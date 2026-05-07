/* eslint-disable prefer-arrow-functions/prefer-arrow-functions */

import { Buffer } from 'node:buffer';

// Cloudflare Workers extends SubtleCrypto with timingSafeEqual
// https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#timingsafeequal
const subtle = crypto.subtle as typeof crypto.subtle & {
  timingSafeEqual(
    a: ArrayBuffer | ArrayBufferView,
    b: ArrayBuffer | ArrayBufferView
  ): boolean;
};

const encoder = new TextEncoder();

/**
 * Protect against timing attacks by safely comparing values using `timingSafeEqual`.
 * Refer to https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#timingsafeequal for more details
 */
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.byteLength !== bBytes.byteLength) {
    return false;
  }

  return subtle.timingSafeEqual(aBytes, bBytes);
}

function unauthorized(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Staging", charset="UTF-8"',
    },
  });
}

// eslint-disable-next-line import/no-default-export
export default {
  async fetch(request, env) {
    const BASIC_USER = env.BASIC_AUTH_USER;
    const BASIC_PASS = env.BASIC_AUTH_PASS;

    const url = new URL(request.url);
    const isApiRoute = url.pathname.startsWith('/api/');

    // Basic Auth check for staging
    if (env.CLOUDFLARE_ENV === 'staging') {
      if (!BASIC_USER || !BASIC_PASS) {
        return new Response(
          'Staging auth is not configured. Set BASIC_AUTH_USER and BASIC_AUTH_PASS as Cloudflare secrets.',
          { status: 500 }
        );
      }

      // Only enforce auth for non api routes in staging worker
      if (!isApiRoute) {
        const authorization = request.headers.get('Authorization');

        if (!authorization) {
          return unauthorized();
        }

        const [scheme, encoded] = authorization.split(' ');

        if (!encoded || scheme !== 'Basic') {
          return unauthorized();
        }

        const credentials = Buffer.from(encoded, 'base64').toString();
        const index = credentials.indexOf(':');
        const user = credentials.substring(0, index);
        const pass = credentials.substring(index + 1);

        if (
          !timingSafeEqual(BASIC_USER, user) ||
          !timingSafeEqual(BASIC_PASS, pass)
        ) {
          return unauthorized();
        }
      }
    }

    // Handle api routes
    if (isApiRoute) {
      return Response.json({
        name: 'Cloudflare',
      });
    }

    // Otherwise fetch the assets
    const assetResponse = await env.ASSETS.fetch(request);

    return assetResponse;
  },
} satisfies ExportedHandler<Env>;
