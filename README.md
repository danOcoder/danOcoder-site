# danocoder-site

Personal site for Dan O'Connor — a single-page React app deployed to Cloudflare Workers.

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **Tailwind CSS 4** (theme in `app/styles/theme.css`)
- **Cloudflare Workers** (SPA assets + `/api/*` routes from `worker/index.ts`)
- **ESLint 9** (flat config) + **Prettier**

## Project structure

```
app/                     # client source — root for the `~/*` import alias
  components/ui/         # reusable UI (Icon component + generated icon sprite)
  styles/                # global.css (resets) + theme.css (Tailwind entry)
  utils/                 # cn() and other shared helpers
  App.tsx, main.tsx      # SPA entrypoint
worker/                  # Cloudflare Worker — handles /api/* and serves assets
other/
  build-icons.ts         # generates icon sprite + IconName type
  svg-icons/             # source SVGs, one per icon
.github/workflows/       # CI + deploy pipelines
public/                  # static assets served at root (favicon, etc.)
```

## Getting started

```bash
npm install              # also wires up git hooks via simple-git-hooks
npm run dev              # starts Vite dev server (default :5173, override via PORT)
```

Copy `.env.example` → `.env` and `.dev.vars.example` → `.dev.vars` if you need local config. Both are gitignored.

## Scripts

| Script                    | What it does                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`             | Vite dev server with HMR                                                               |
| `npm run build`           | TypeScript project build + Vite production bundle                                      |
| `npm run preview:staging` | Build + locally preview the staging bundle                                             |
| `npm run typecheck`       | Generates Worker types, then runs `tsc --noEmit`                                       |
| `npm run lint`            | ESLint across the repo                                                                 |
| `npm run format`          | Prettier across the repo                                                               |
| `npm run build:icons`     | Regenerates `app/components/ui/icons/sprite.svg` + `name.d.ts` from `other/svg-icons/` |
| `npm run cf-typegen`      | Regenerates `worker-configuration.d.ts` from `wrangler.jsonc`                          |

## Imports

The `~` alias points at `app/` — configured in both `tsconfig.app.json` and `vite.config.ts`:

```tsx
import { Icon } from '~/components/ui/Icon';
import { cn } from '~/utils/cn';
```

## Icons

SVGs live in `other/svg-icons/`. Running `npm run build:icons` produces:

- `app/components/ui/icons/sprite.svg` — single sprite with each SVG as a `<symbol>`
- `app/components/ui/icons/name.d.ts` — union type of valid icon names for type-safe usage

Use them via the `<Icon />` component — see `app/components/ui/Icon/README.md` for props and a11y guidance.

## Deployment

Two environments, both managed in `wrangler.jsonc`:

- **Staging** — auto-deploys on every push to `main`. Protected by Basic Auth (set `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` as Cloudflare secrets).
- **Production** — auto-deploys on tags matching `v*.*.*`.

Both deploy workflows depend on `_checks.yml` (audit, typecheck, lint, build) passing first.

To cut a release:

```bash
git tag v0.1.0
git push --tags
```

## CI

`.github/workflows/_checks.yml` is the reusable check pipeline:

1. `npm ci`
2. `npx audit-ci` — fails on moderate+ severity, allowlist in `audit-ci.jsonc`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`

Runs on every PR (`ci.yml`) and as a gate before each deploy.

## Git hooks

Wired via `simple-git-hooks` (installed by `postinstall`):

- **pre-commit** — `lint-staged` runs Prettier + ESLint --fix on staged files
- **pre-push** — `npm run typecheck`

If you ever need to skip them: `git commit --no-verify` (don't make it a habit).

## Security

Dependency CVEs tracked via `audit-ci`. Migration trackers and audit notes live in [`SECURITY.md`](./SECURITY.md).
