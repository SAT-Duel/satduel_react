# SAT Duel Onboarding Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three-step, promotion-heavy first-run flow with polished two-step setup, a Practice-first destination picker, and a one-time Discord modal after the first saved practice answer.

**Architecture:** Keep setup and destination selection in their existing pages. Put browser persistence and the first-answer signal in the existing `discordPromo` utility, emit the signal from the successful practice-answer path, and let `AppLayout` own the accessible dialog above the logged-in workspace.

**Tech Stack:** React 18, React Router 6, Tailwind CSS 4, Lucide React, Node's built-in test runner, Vite 6.

## Global Constraints

- Do not add dependencies or a generalized onboarding framework.
- Preserve invitation redirects and existing backend request contracts.
- Keep legal acceptance required and marketing email optional.
- Show the Discord offer only to non-Premium users after their first successfully saved practice answer.
- Store Discord promotion dismissal per user and never block practice when storage is unavailable.
- Reuse SAT Duel's existing UI primitives and violet/cyan/amber learning-product language.
- Verify desktop and mobile in at most two bounded screenshot passes.

---

### Task 1: First-answer Discord promotion state

**Files:**
- Modify: `src/utils/discordPromo.js`
- Create: `src/utils/discordPromo.test.js`
- Modify: `src/pages/trainer/InfiniteQuestionPage.jsx`

**Interfaces:**
- Produces: `DISCORD_PROMO_EVENT`, `dismissDiscordPromo(userId)`, `shouldShowDiscordPromo(userId)`, and `isFirstPracticeAnswer(stats)`.
- Consumes: `response.data.practice_stats` from the existing successful `api/check_answer/` request.

- [ ] **Step 1: Write failing utility tests**

```js
test('dismissal is scoped to one user', () => {
    dismissDiscordPromo(7);
    assert.equal(shouldShowDiscordPromo(7), false);
    assert.equal(shouldShowDiscordPromo(8), true);
});

test('only an answered total of one is the first answer', () => {
    assert.equal(isFirstPracticeAnswer({practice_answered: 1}), true);
    assert.equal(isFirstPracticeAnswer({practice_answered: 2}), false);
    assert.equal(isFirstPracticeAnswer(), false);
});
```

- [ ] **Step 2: Run `node --test src/utils/discordPromo.test.js` and confirm failure because user-scoped helpers and first-answer detection do not exist.**

- [ ] **Step 3: Implement minimal user-scoped localStorage helpers and first-answer detection**

```js
export const DISCORD_PROMO_EVENT = 'satduel:discord-promo-eligible';

const promoKey = (userId) => `sd:discord-premium-promo-dismissed:${userId}`;

export function dismissDiscordPromo(userId) {
    if (userId == null) return;
    try { window.localStorage.setItem(promoKey(userId), 'true'); } catch {}
}

export function shouldShowDiscordPromo(userId) {
    if (userId == null) return false;
    try { return window.localStorage.getItem(promoKey(userId)) !== 'true'; } catch { return false; }
}

export function isFirstPracticeAnswer(stats) {
    return stats?.practice_answered === 1;
}
```

- [ ] **Step 4: Run the utility test and confirm all cases pass.**

- [ ] **Step 5: After a successful practice answer, dispatch `DISCORD_PROMO_EVENT` only when `isFirstPracticeAnswer(response.data.practice_stats)` is true.**

- [ ] **Step 6: Run the utility test again and run `npm run build`.**

---

### Task 2: Two-step profile setup and Practice-first picker

**Files:**
- Modify: `src/pages/CompleteProfilePage.jsx`
- Modify: `src/components/AccountSetupFields.jsx`
- Modify: `src/pages/WelcomePage.jsx`

**Interfaces:**
- `CompleteProfilePage` continues posting `username`, names, grade, SAT date, `marketing_opt_in`, and `terms_accepted` to `api/auth/complete_profile/`.
- `WelcomePage` continues consuming invitation redirects and `setFirstLogin()`.

- [ ] **Step 1: Collapse setup to two steps**

```jsx
<SetupProgress step={step} labels={['About you', 'SAT date']}/>
```

Move `<MarketingChoice>` directly below `<TermsAgreement>` on step 1, submit the saved profile from step 2, remove `setupComplete`, and navigate to `/welcome` after success.

- [ ] **Step 2: Refine consent presentation**

Render the legal checkbox and optional marketing switch as one clearly titled consent group with concise copy, without creating a third page or nested card.

- [ ] **Step 3: Redesign the start picker**

Make Practice the dominant recommended section with direct English and Math buttons. Render Duel and Tournament as quieter secondary actions and retain the dashboard skip link.

- [ ] **Step 4: Run `npm run build` and confirm the two edited routes compile.**

---

### Task 3: Accessible Discord promotion modal

**Files:**
- Modify: `src/layout/AppLayout.jsx`
- Modify: `src/utils/discordPromo.test.js`

**Interfaces:**
- Consumes: `DISCORD_PROMO_EVENT` emitted by the practice page and user-scoped helpers from `discordPromo.js`.
- Produces: a one-time dialog for eligible non-Premium users.

- [ ] **Step 1: Add a failing storage-unavailable test**

```js
test('storage failure keeps the promotion closed', () => {
    global.window.localStorage.getItem = () => { throw new Error('blocked'); };
    assert.equal(shouldShowDiscordPromo(7), false);
});
```

- [ ] **Step 2: Run `node --test src/utils/discordPromo.test.js` and confirm it fails if the helper opens on storage errors.**

- [ ] **Step 3: Keep the storage helper fail-closed and run the test green.**

- [ ] **Step 4: Replace the automatic sidebar tooltip with an event-driven dialog**

Listen for `DISCORD_PROMO_EVENT`, gate on the active non-Premium user and `shouldShowDiscordPromo(user.id)`, and render a compact modal with `role="dialog"`, `aria-modal="true"`, Escape handling, initial close-button focus, focus restoration, a Discord link, and a secondary “Maybe later” action.

- [ ] **Step 5: Mark the promotion handled when either action is chosen. Keep the persistent sidebar Discord link but remove its automatic tooltip.**

- [ ] **Step 6: Run utility tests and `npm run build`.**

---

### Task 4: Bounded visual QA and branch delivery

**Files:**
- Inspect: `/complete_profile`, `/welcome`, and `/infinite_questions`
- Modify only files already in scope if the inspection reveals defects.

**Interfaces:**
- Consumes the completed React build.
- Produces a verified pushed branch.

- [ ] **Step 1: Start the local Vite app and inspect setup, picker, and modal at desktop and mobile widths in one browser pass.**

- [ ] **Step 2: Batch-fix any overflow, hierarchy, focus, or responsive defects found.**

- [ ] **Step 3: Perform at most one confirmation pass.**

- [ ] **Step 4: Run fresh verification:**

```bash
node --test src/utils/discordPromo.test.js
npm run build
git diff --check
```

- [ ] **Step 5: Commit implementation changes and push `codex/practice-question-toolbar` to `origin`.**
