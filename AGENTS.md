# KEMENHAJ — Portal Layanan Kemenhaj Pare

Full-stack Next.js app: an Indonesian public-service portal (news, service requirements, org profile, gallery) plus an internal dashboard (CMS) for services and PDF forms. `PRD.md` defines product scope (written in Indonesian) and `DESIGN.md` defines the design system; both are committed here and are the source of truth.

## Commands (run from this repo root)

- `npm run dev` — Next dev server on http://localhost:3000
- `npm run build` / `npm start`
- `npm run lint` — runs bare `eslint` (whole repo); it passes clean today
- `npx tsc --noEmit` — typecheck; there is **no** `typecheck` script, no test suite, and no CI yet
- `npm run db:generate` / `db:migrate` / `db:seed` / `db:studio` — Drizzle migration and seed workflow
- `docker compose up -d db` — local PostgreSQL 17 with user/password/db `kemenhaj`

## Toolchain quirks

- Next 16 App Router + React 19 + Tailwind v4. There is **no** `tailwind.config.*` or PostCSS file: theme tokens and variants live in `app/globals.css` (`@theme`, `@theme inline`, `:root`). `next.config.ts` enables `cacheComponents`, `partialPrefetching`, experimental `agentFeedback`, registers the Tailwind turbopack CSS loader, and pins `turbopack.root` to `process.cwd()`.
- PostgreSQL + Drizzle ORM (`lib/db/schema.ts`, migrations in `drizzle/`). `lib/db/index.ts` throws if `DATABASE_URL` is missing. `drizzle.config.ts` loads `.env` via `@next/env`.
- Auth is iron-session + Argon2id (`lib/auth/*`). `SESSION_PASSWORD` must be ≥32 chars. Session reads call `connection()` so admin pages are dynamic and don't trip prerendering `Date.now()` errors.
- `proxy.ts` (Next 16's renamed middleware) only does an optimistic cookie-presence redirect for `/admin`; real authorization lives in `lib/data` via `requirePermission()`.
- shadcn/ui is **admin-only**: `components.json` points `aliases.ui` to `@/components/admin/ui`, and the 18 installed primitives use Base UI + `cva`. The public site keeps the hand-rolled primitives in `components/ui.tsx` (`cn`, pill/eyebrow/tag/section). Don't mix the two.
- `cn` is still a local helper in `lib/utils.ts` (re-exported from `cn`); admin shadcn files import it as `@/lib/utils`.
- Path alias `@/*` maps to the repo root (`@/components`, `@/lib`).
- `DESIGN.md` specifies the commercial Saans font; `app/layout.tsx` uses Inter as its documented substitute. Don't add Saans assets.

## Current state

- Public route group `app/(public)/` with its own nav/footer layout: `/`, `/berita`, `/berita/[slug]`, `/layanan`, `/layanan/[slug]`, `/profil`, `/galeri`, `/pencarian`. Root `app/layout.tsx` only renders `<html>/<body>`.
- Services, news, officials, and galleries are **database-backed**: public pages read via `lib/data/*`, the admin panel mutates through Server Actions, and each module has its own cache tag.
- Admin: `/admin/login` plus `app/admin/(panel)/{page,layanan,layanan/baru,layanan/[id],berita,pejabat,galeri,aktivitas,profil}`. Only one role exists: `superadmin` (all permissions). There is a single seeded account; no user CRUD. Name/email/password are self-service on `/admin/profil`. Seed account documented in `README.md`.
- PDFs live in `storage/uploads/` (gitignored except `.gitkeep`) and stream through `app/api/files/[id]`. Unpublished media requires a session.
- Public data is cached with `'use cache'` + `cacheLife('hours')` + per-module tags `services`, `articles`, `officials`, `galleries`; mutations call `updateTag(tag)` — `revalidateTag(tag, 'max')` serves stale content for a year and is wrong for read-your-own-writes here.
- Sidebar/table/dialog interactions come from `components/admin/*`; toasts are replaced with inline `Alert` messages.
- Home hero uses `components/home-hero-slider.tsx`; every other top-level page uses `components/page-banner.tsx`. Detail pages keep the text-only `components/page-hero.tsx`.
- `next/image` is used throughout; Next 16 deprecates the `priority` prop in favor of `preload` — use `preload` in new code.
- Installed agent skills live in `.agents/skills/` with hashes pinned in `skills-lock.json`.
- User-facing copy should be Indonesian.

## Design constraints (from DESIGN.md)

- Warm brown-and-gold palette: canvas `#fffdf8`, ink `#221a12`, gold `#c9963f`, espresso `#2c1d12`; no shadows — use fills and hairline borders only.
- Public tokens were renamed to free shadcn's names: `text-subtle` (was `text-muted`) and `bg-signal` (was `bg-accent`). Don't reintroduce `--color-muted`/`--color-accent` in `@theme`; `:root` owns the shadcn variables.
- Every interactive element is a stadium pill (`rounded-full`); rectangular buttons are off-system. Admin primitives get `rounded-full` overrides where used.
- Accent/signal `#8f5b12` is reserved for signals, never for CTAs; CTAs stay ink pills. Gold is decorative.
- No letter-spacing or all-caps; sentence-case headings.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
