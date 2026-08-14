# SAT Duel frontend

React 18 + Vite + Tailwind v4. Deployed to Netlify at https://satduel.com.
Backend lives in the sibling `satduel/` repo (Django, Heroku).

## Read this before UI work

**[docs/frontend-design-guidelines.md](docs/frontend-design-guidelines.md) is the
project taste file. Read it before changing any page, layout, component, or
page-level copy.** It covers the two design modes, data presentation, and the
per-page rules (practice, leaderboard, dashboard, profile).

## Two token systems — do not mix them

This is the single most common way UI work goes wrong here. The app has two
visual zones on purpose, each with its own palette:

| | Public / marketing | Logged-in app |
|---|---|---|
| Shell | `SecondaryLayout` (or fullscreen) | `AppLayout` |
| Wrapper | `<div className="sd-landing" data-theme={theme}>` | plain Tailwind |
| Tokens | `--sd-*` CSS vars from `src/styles/landing.css` | `@theme` tokens in `src/index.css` |
| Usage | `text-[var(--sd-text)]`, `bg-[var(--sd-panel)]` | `text-slate-900`, `bg-primary-600` |
| Theme | dark by default, light toggle via `useSdTheme` | always light |
| Routes | `/`, `/pricing`, `/about`, `/diagnostic`, the SEO guides, `/welcome`, `/complete_profile` | everything in `APP_ROUTES` |

Rules:

- Never use `--sd-*` vars inside an `AppLayout` page.
- Never use `slate-*` / `primary-*` as the *base* palette inside `.sd-landing`.
- A page belongs to exactly one zone. If you are unsure which, check whether its
  route sits in `MARKETING_ROUTES` or `APP_ROUTES` in `src/components/Router.jsx`.
- Reuse the primitives in `src/components/ui` before writing new ones.

`styled-components` (`src/styles/theme.js`, `src/styles/globalStyles.js`,
`src/components/common/`) is legacy and only wraps a handful of old files. Do
not add new styled-components usage; port to Tailwind when you touch one.

## SEO

**`src/seo/routes.js` is the single source of truth** for every public page's
title, description, path and social card. Three things read it, which is what
keeps them from drifting apart:

1. `<SEO seoKey="...">` at runtime — what Google sees after it runs the JS.
2. `scripts/prerender.mjs` at build time — what link-preview crawlers see.
3. The generated `sitemap.xml`.

`routes.js` exports two lists:

- **`SEO_ROUTES`** — public, indexable, in the sitemap.
- **`SHARE_ROUTES`** — login-gated app routes people paste into Discord
  (`/party`, `/study_guides`, `/tournaments`, …). Prerendered with the right OG
  card but `noindex` and no canonical, and never in the sitemap. Without an
  entry here a shared app URL falls back to `index.html` and previews as the
  generic site card — which is the whole reason this list exists.

**Adding a public page:** add an entry to `SEO_ROUTES`, add the route in
`src/components/Router.jsx`, render `<SEO seoKey="yourKey"/>`, and link to it
from `SATFooter` so it is reachable. The sitemap and prerendered HTML follow
automatically.

**Dynamic invite links** (`/party/:roomId`, `/tournament/:id`) can't be
prerendered per-instance, so `public/_redirects` maps those prefixes onto the
matching share card. Serving another route's HTML is safe because every
prerendered file is the same full SPA shell — React still reads the real URL.

**robots.txt:** never `Disallow` a path that has a share card. Blocking the
fetch hides the `noindex` from Google *and* stops X's card crawler from reading
the OG tags. A test enforces this.

**Why prerendering exists:** Discord, iMessage, Slack and X do not run
JavaScript, so they only read the HTML the server returns. For an SPA that is
always `index.html`, which made every URL preview as the site-wide default.
`npm run build` now writes `build/<path>/index.html` per route with only the
`<head>` metadata swapped between the `<!-- seo:start -->` / `<!-- seo:end -->`
markers. Netlify serves an existing file before the `/* /index.html 200`
fallback in `public/_redirects`, so crawlers get the right tags and humans get
the same SPA. Keep those markers in `index.html`.

Every managed tag carries `data-rh="true"` so `react-helmet-async` replaces it
on mount instead of appending a second copy — without it every page ships two
`<link rel="canonical">`. Use `react-helmet-async`, never `react-helmet`: v6 is
silently broken under React 18 and applied no tags at all.

**Social cards** live in `public/og/`, one per feature, generated from
`docs/og-image.html`. Each card leads with the single thing its page is for.
Edit the `VARIANTS` map there, then:

```bash
npm run og
```

**Verifying meta tags:** the browser preview pane caches aggressively and will
lie about `document.title`. Dump the DOM after JS instead:

```bash
npx serve build -l 4182 & sleep 5 && "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --virtual-time-budget=6000 --dump-dom http://localhost:4182/sat-party-game | grep -E '<title>|canonical|og:image'
```

- The Discord invite has one home: `DISCORD_INVITE` in
  `src/components/Discord.jsx`. Import it; never paste an invite URL inline.

## Checks

`npm run build` must pass. `npm test` runs the util tests.
For visual changes, inspect at desktop and mobile widths — screenshots beat
confident prose.
