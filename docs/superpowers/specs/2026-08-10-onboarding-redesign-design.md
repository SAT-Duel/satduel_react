# SAT Duel Onboarding Redesign

**Date:** 2026-08-10
**Status:** Approved for implementation

## Goal

Move new students from registration to a real SAT practice question with less ceremony and stronger visual hierarchy. The onboarding should feel like a focused SAT Duel product experience, not a sequence of marketing pages.

Success means a new student can complete required account setup, intentionally choose English or Math practice, and reach the corresponding practice page without encountering a Discord advertisement first.

## User Flow

1. A newly registered or first-login student completes a two-step profile setup.
2. The student lands on the start picker unless an existing invitation redirect takes precedence.
3. Practice is the recommended choice. The student selects English or Math and goes directly to that practice subject.
4. Duel and Tournament remain available as secondary starting choices.
5. After a non-Premium student successfully submits their first-ever practice answer, a dismissible Discord promotion modal appears.
6. The modal is never shown again after the student dismisses it or follows its Discord link.

## Profile Setup

The existing three-step profile flow becomes two steps:

### Step 1: About You

- Public username.
- First and last name.
- Grade when it has not already been collected.
- Required Terms of Service and Privacy Policy acknowledgement.
- Optional marketing email toggle directly below the legal agreement in the same consent section.

The marketing choice is no longer a standalone onboarding page. Its copy must make clear that it is optional and can be changed by unsubscribing later.

### Step 2: SAT Date

- Keep the existing SAT-date choices.
- Keep “I don’t know yet” as a valid option.
- Explain briefly that the date powers the dashboard countdown.

Submitting step 2 saves the complete profile and navigates directly to `/welcome`. The full-page Discord offer is removed entirely.

## Start Picker

The start picker remains a one-screen decision, but its hierarchy changes:

- Practice is the visually dominant, recommended action.
- Practice includes two equally clear subject choices:
  - English → `/infinite_questions`
  - Math → `/infinite_questions?subject=math`
- Duel and Tournament are quieter secondary choices.
- The dashboard skip link remains available.
- Invitation redirects continue to bypass the picker.

The visual direction uses SAT Duel’s incumbent product language: score-strip accents, answer-bubble motifs, violet/cyan/amber color roles, controlled chunky controls, and calm workspace typography. It must avoid a generic marketing hero, decorative card stacks, nested cards, or oversized explanatory copy.

## Discord Promotion

### Eligibility

Show the modal only when all conditions are true:

- The student is authenticated.
- The student is not Premium.
- The student has just successfully submitted their first-ever practice answer.
- The promotion has not already been dismissed or opened on this browser for that user.

An API failure or an answer-selection click that is not successfully saved must not trigger the modal.

### Presentation

The promotion is a compact accessible dialog, not a full onboarding screen or sidebar tooltip. It contains:

- A brief “one month of Premium free” headline.
- One sentence explaining that the code is available in the SAT Duel Discord.
- A primary “Join Discord” link.
- A clear secondary dismissal.

Opening the Discord link also records the promotion as handled. The existing persistent Discord community link may remain in the app navigation, but it must not display an automatic tooltip.

### Persistence

Promotion state is stored per user in `localStorage` so students sharing a browser do not suppress one another’s prompt. Storage failures degrade safely: the product remains usable and the modal does not block practice.

## Components and Data Flow

- `CompleteProfilePage` owns the two-step form state and final profile request.
- `AccountSetupFields` keeps the reusable legal, marketing, progress, and SAT-date controls.
- `WelcomePage` owns the start-picker presentation and destination links.
- The practice answer handler emits a promotion-eligibility signal only after the first successful answer response.
- `AppLayout` listens for that signal and owns the modal so it sits above the logged-in workspace without coupling promotion markup to the question card.
- `discordPromo` owns user-scoped persistence and eligibility helpers.

No new dependency or generalized onboarding framework is needed.

## Accessibility and Responsive Behavior

- Preserve native form labels, fieldsets, radio buttons, and checkboxes.
- The modal uses dialog semantics, has an accessible name, supports Escape dismissal, and prevents interaction with content behind it while open.
- Focus moves into the modal on open and returns to the prior control after close.
- Selection and recommendation states use labels and structure, not color alone.
- The start picker becomes a single-column layout on narrow screens, with large touch targets and no clipped button labels.
- Both desktop and mobile must keep the recommended Practice action immediately understandable without scrolling through decorative content.

## Error Handling

- Existing inline setup validation remains.
- Profile submission failures keep the student on step 2 with entered data intact.
- SAT-date loading failures retain “I don’t know yet” and surface the existing inline error.
- Discord persistence errors are ignored because they must never interrupt learning.

## Verification

- Add focused tests for user-scoped Discord promotion persistence and first-answer eligibility logic.
- Verify the setup has two steps and sends the marketing preference with the final profile request.
- Verify Practice is recommended and both subject links resolve correctly.
- Verify the Discord modal opens only after the first successful practice answer, dismisses accessibly, and does not repeat.
- Run the frontend build.
- Inspect the setup, start picker, practice page, and modal at desktop and mobile widths in one bounded visual QA pass, then perform at most one confirmation pass after fixes.

## Out of Scope

- Backend schema or API contract changes.
- A guided product tour.
- A simulated onboarding question.
- Changes to the Premium redemption mechanism or Discord promotion terms.
- Redesigning the broader logged-in navigation or practice question interface.
