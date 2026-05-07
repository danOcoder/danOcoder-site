import path from 'node:path';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const PORT = env.PORT ? Number(env.PORT) : 5173;

  return {
    build: {
      assetsInlineLimit: (source: string) => {
        // prevent inlining of these assets
        if (source.endsWith('sprite.svg') || source.endsWith('favicon.ico')) {
          return false;
        }

        return undefined;
      },
    },
    server: {
      port: PORT,
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './app'),
      },
    },
    plugins: [tailwindcss(), react(), cloudflare()],
  };
});
