# SAT Duel Frontend Design Guidelines

This guide is the project taste file for SAT Duel frontend work. Future Codex conversations should read it before changing UI, UX, layout, stats presentation, or page-level copy.

The short version: SAT Duel should feel like a focused learning product after login and a distinctive SAT-native brand before login.

## Core Product Taste

SAT Duel is an educational website first. The interface should help students answer questions, understand progress, and come back tomorrow. It is not a generic SaaS dashboard and not a decorative marketing template.

Use the existing SAT Duel visual language:

- Violet, cyan, amber, emerald, and slate accents.
- `sat-bubble-field` backgrounds.
- `sat-arena-card` surfaces.
- `sat-score-strip` bands.
- SAT answer bubbles and answer-choice rhythm.
- Duel, practice, streak, score, and question motifs.
- Existing React/Tailwind primitives from `src/components/ui`.
- Lucide icons when an icon is useful.

Do not replace the project's style system with a new design system unless explicitly asked.

## Two Design Modes

### Logged-In Learning Pages

Logged-in pages are student workspaces. They should feel closer to Brilliant, Khan Academy, or Codecademy after login: calm, useful, readable, and task-focused.

Examples:

- `/trainer`
- `/infinite_questions`
- `/ranking`
- `/profile`
- `/settings`
- `/study_guides`
- `/tournaments`
- `/classes`
- practice-test and duel flows

Rules:

- No landing-page heroes inside the logged-in portal.
- No big blocks explaining obvious workflows.
- No decorative section stacks just to fill space.
- No "three marketing cards in a row" pattern unless those are truly user actions.
- Keep primary workflows visible immediately.
- Keep controls near the task they affect.
- Use smaller, quieter secondary text for details.
- Make pages scannable before making them flashy.
- Prefer dense but organized layouts over oversized cards.
- Use cards for repeated items, panels, tools, and modals. Do not nest cards inside cards.
- Keep page sections unframed when a full card is not needed.

The right feeling: "I know what to do next."

The wrong feeling: "This page is trying to sell me the thing I already logged in to use."

### Public and Marketing Pages

Public pages can be more expressive, but they should still feel SAT Duel-specific.

Examples:

- `/`
- `/pricing`
- `/about`
- `/digital-sat-practice`
- `/sat-math-practice`
- `/sat-reading-and-writing-practice`
- `/diagnostic`
- `/terms`
- `/privacy`

Rules:

- Do not make generic SaaS marketing pages.
- Avoid anonymous gradients, stock-looking blobs, and interchangeable feature cards.
- Use SAT-native visuals: answer choices, question previews, score slips, duel lanes, tournament boards, streak strips, diagnostic snippets, and actual product states.
- Add personality where it helps: team voice, real study pressure, playful answer-bubble details, and SAT Duel's competitive-learning angle.
- Keep the brand/product visible in the first viewport.
- If using a hero, make it specific and useful, not just decorative.
- Pricing should be clear, trustworthy, and direct.
- Legal pages should stay plain and readable.

The right feeling: "This is clearly SAT Duel."

The wrong feeling: "This could be any AI education startup."

## Data Presentation

Stats should be honest, sparse, and easy to interpret.

Primary stats:

- Practice Elo.
- Duel Elo.
- Daily streak.
- Correct streak.
- English questions answered.
- Math questions answered.
- Accuracy when the denominator is clear.

Rules:

- Show one or two primary numbers first.
- Put secondary numbers in smaller type.
- Do not make every number visually loud.
- Label streaks precisely:
  - "Daily streak" means consecutive days completing the daily practice goal.
  - "Correct streak" means consecutive correct answers.
- Distinguish English and Math practice data everywhere.
- Do not show old inflated `problems_solved` as a learning stat.
- If a number can be misunderstood, rename it before adding an explanation block.

## Practice Page Rules

The infinite-practice page is the core learning loop.

Required behavior and presentation:

- The current question must remain locked until answered.
- Do not show question numbers for the infinite-practice flow.
- Practice Elo must be visible without scrolling on normal desktop layouts.
- Keep the Elo number large enough to matter.
- Keep the before/after Elo update box when an answer changes Elo.
- Do not show a `+1 correct streak` popup.
- If showing a positive feedback moment, make it about the answer and Elo change.
- Topic selection is a Premium feature and should be visible, but it should not make the page awkward.
- Subject switching between English and Math should be obvious and near the practice controls.
- The question area should remain the visual center.
- Keep explanation/review visible after answering, then provide a clear next-question action.

Good hierarchy:

1. Question and answers.
2. Practice Elo / subject / topic controls.
3. Feedback after answer.
4. Streak and daily progress.
5. Small details.

## Leaderboard Rules

The leaderboard should be simple and informative.

Rules:

- Put metric and subject switches at the top, not below the list.
- Avoid a big hero explaining how leaderboards work.
- Rows should be readable at a glance: rank, student, primary metric.
- Secondary details belong in smaller text.
- Distinguish English Practice Elo and Math Practice Elo.
- Correct-streak leaderboard should be named as a correct-answer streak, not daily streak.
- Avoid stat clutter in every row.
- Keep the user's own rank visible but not overwhelming.

## Home Dashboard Rules

The dashboard should answer: what should I do today, and what changed?

Rules:

- Daily focused practice should be prominent.
- Show the few numbers that matter.
- English/Math stats should be separated.
- Keep action cards practical: practice, duel, tournaments, study guides.
- Avoid marketing copy in the logged-in dashboard.
- Keep mini-games secondary.

## Profile Page Rules

Profile pages are for identity and progress, not a stats dump.

Rules:

- Show Duel Elo, English Practice Elo, Math Practice Elo, correct streak, and accuracy.
- Practice stats should use real practice attempts.
- Separate English answered and Math answered.
- Do not display the old `problems_solved` field.
- Keep edit/profile actions obvious on the owner's profile.
- Keep other-user profile pages readable and comparable.

## Existing Implementation Patterns

Prefer these before inventing anything:

- `src/components/ui/index.jsx`
  - `Button`
  - `Card`
  - `PageContainer`
  - `Input`
  - `Select`
  - `Alert`
  - `Spinner`
- `src/layout/AppLayout.jsx` for logged-in app shell.
- `src/layout/SecondaryLayout.jsx` for public pages.
- `src/components/Router.jsx` for route placement.
- `src/components/SATFooter.jsx` for public footer links.
- `src/components/UserAvatar.jsx` for user identity.
- `src/components/SEO.jsx` for metadata.

Use local Tailwind class conventions. Do not add a styling library for ordinary layout work.

## Visual Quality Rules

Always check:

- Mobile and desktop layout.
- No overlapping text or controls.
- No clipped button text.
- No layout shifts from hover or dynamic values.
- Long usernames, long topics, and long question types.
- Empty states.
- Loading states.
- Error states.
- Premium/free states.

Use stable dimensions for:

- Toolbars.
- Icon buttons.
- Stats tiles.
- Leaderboard rows.
- Question controls.
- Answer choices.
- Any repeated grid item.

Avoid:

- Generic gradient-orb backgrounds.
- Bokeh decoration.
- Cards inside cards.
- Oversized headings inside compact panels.
- Dense clusters of unlabeled numbers.
- Marketing heroes in logged-in pages.
- New components when an existing primitive works.

## Validation Workflow

For frontend changes:

1. Read the existing page and neighboring components first.
2. Reuse local patterns.
3. Make the smallest change that solves the product issue.
4. Run `npm run build`.
5. For visual/layout changes, inspect with the browser at desktop and mobile sizes when available.
6. If changing stats, verify the API field names and whether data is user-specific, profile-specific, or global.

For major visual work, screenshots matter more than confident prose.

## Quick Checklist

Before finishing a frontend task, ask:

- Is this a logged-in learning page or a public page?
- Did I avoid marketing-page patterns inside the app shell?
- Is the main student action obvious?
- Are the important numbers readable without shouting?
- Are English and Math stats separated where relevant?
- Did I preserve SAT Duel's visual language?
- Did I avoid adding a new abstraction?
- Did the build pass?
- Did I visually inspect if layout changed?

## Default Decision

When unsure:

- Logged-in page: choose simpler, quieter, more focused.
- Public page: choose more distinctive, more SAT Duel-specific, less generic.
- Component design: reuse existing primitives.
- Stats: fewer numbers, clearer labels.
- Implementation: the smallest working diff.
