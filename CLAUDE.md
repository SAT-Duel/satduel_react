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

- Every public page renders `<SEO>` from `src/components/SEO.jsx`. Private and
  transactional pages pass `noindex`.
- Adding an indexable public route means adding it to `public/sitemap.xml` too.
- Link-preview crawlers (Discord, iMessage, Slack, X) **do not run JavaScript**.
  They only ever see the static tags in `index.html` — never the per-route
  `<SEO>` tags. Sharing-facing copy and images belong in `index.html`.
- `public/og-image.png` is the 1200x630 social card. Regenerate it from
  `docs/og-image.html` when the tagline changes:

  ```bash
  npx serve docs -p 8899 & "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --screenshot=public/og-image.png --virtual-time-budget=4000 http://localhost:8899/og-image.html
  ```

- The Discord invite has one home: `DISCORD_INVITE` in
  `src/components/Discord.jsx`. Import it; never paste an invite URL inline.

## Checks

`npm run build` must pass. `npm test` runs the util tests.
For visual changes, inspect at desktop and mobile widths — screenshots beat
confident prose.
