// Secret and .dev.vars properties that wrangler types can't generate in CI
// (only vars from wrangler.jsonc are included in the generated Env interface)
declare namespace Cloudflare {
  interface Env {
    BASIC_AUTH_USER?: string;
    BASIC_AUTH_PASS?: string;
  }
}
