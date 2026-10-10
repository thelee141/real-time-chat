# AGENTS.md

## Commands

- Package manager is **npm** (`package-lock.json` is the lockfile).
- `npm run dev` — dev server on :3000. Requires `.env.local` (see below).
- `npm run build` — production build (also serves as the type check; there is no separate typecheck script).
- `npm run lint` — ESLint 9 flat config over the whole repo.
- `npm run gen-types` — regenerates `lib/supabase/types/database.ts` from the live hosted Supabase project. **Run this after any database schema change**; hand-editing the generated file is wrong. The script has the Supabase project ID hardcoded. Use `npm run gen-types:local` to regenerate from the local stack instead.
- There is no test suite in this repo. For manual testing, a Supabase local project lives in `supabase/` (migrations, RLS, triggers, seed); run it with `npm run db:start` — see README for the Codespace flow.

## Environment (`.env.local`, gitignored)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- `SUPBASE_SECRET_KEY` — note the typo: it is **`SUPBASE`**, not `SUPABASE` (read at `lib/supabase/server.ts:39`). Used by `createAdminClient()`, which bypasses RLS — only use it in server-side code and re-check auth/membership in code, as the existing server actions do.

## Architecture

Next.js 16 App Router + Supabase (Auth, Postgres, Realtime). Deployed on Vercel.

- **Session refresh lives in `proxy.ts`** (Next.js 16's replacement for `middleware.ts`), which delegates to `updateSession()` in `lib/supabase/middleware.ts`. Unauthenticated users hitting `/rooms` are redirected to `/`. Don't rename `proxy.ts` back to `middleware.ts`.
- Three Supabase clients, all in `lib/supabase/`:
  - `client.ts` — browser client (anon key).
  - `server.ts` `createClient()` — cookie-based server client (used for auth/session reads).
  - `server.ts` `createAdminClient()` — service-key client used by most server actions in `actions/`.
- Under Fluid compute, never cache Supabase server clients in a global/module variable; create a new one per request (see comments in `lib/supabase/middleware.ts` and `server.ts`). Also don't add code between `createServerClient` and `supabase.auth.getClaims()` in the middleware — it breaks session refresh.
- Room realtime uses Supabase **broadcast** on private channels named `room:<roomId>:messages` (see `app/rooms/[id]/_client.tsx`), with DB writes done via server actions, not channel sends.
- **The hosted project is the source of truth for production schema**, but a local mirror now exists in `supabase/` (created for Codespace testing): `supabase/migrations/` (tables, triggers, RLS, realtime publication) and `supabase/seed.sql` (demo users `alice@example.com` / `bob@example.com`, password `password123`, plus a demo room). If you change the hosted schema, mirror the change in a migration here. Before creating migrations/RLS/realtime/edge-function changes, follow the prompt guides in `.github/rules/` (notably: `use-realtime.prompt.md` forbids `postgres_changes` for new code — the existing room client in `app/rooms/[id]/_client.tsx` predates that rule and still uses it; migration naming `YYYYMMDDHHmmss_short_description.sql`).
- The login page has a dev-only email/password sign-in form (visible only when `NODE_ENV === 'development'`) backed by the local stack; production sign-in is OAuth-only.
- UI is shadcn/ui (new-york style) + Tailwind v4 (CSS-based config in `app/globals.css`, no `tailwind.config.*`). Custom component registries are defined in `components.json`. Path alias is `@/*` → repo root.
- `typedRoutes` is enabled (`next.config.ts`), so route strings in `Link`/`redirect` are type-checked; `app/auth/oauth/route.ts` handles the OAuth callback.

## Style

- Prettier: no semicolons, single quotes, 2-space indent.
- ESLint enforces `simple-import-sort` as an **error** — unsorted imports fail `npm run lint`. Keep imports grouped/sorted when editing.
- Component/animation patterns: Framer Motion wrappers in `components/animated-*.tsx`; forms use react-hook-form + zod schemas from `lib/schemas/`.

## Git

- PRs merge to `main`; feature branches are named `shamar/<topic>`.
- A Vercel bot opens dependency-security PRs (e.g. `vercel/react-server-components-cve-*`); treat those as external.
