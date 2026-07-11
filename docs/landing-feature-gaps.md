# Landing Page Feature Gaps

The redesigned landing page (`src/pages/HomePage.jsx`, from the July 2026 design handoff)
advertises several features that do not exist in the product yet (items marked DONE have since shipped). Each section below is a
self-contained task brief written as instructions for an AI coding session. Backend work
happens in the `satduel` Django repo (`api/` app); frontend in `satduel_react`.

Ordered roughly by how prominently the landing page promises the feature.

---

## 1. Optional manual practice timer — ✅ DONE (July 2026)

Practice now opens directly on a question. Timing is an optional, locally persisted
start/pause/reset tool and no longer affects Elo or profile statistics.

## 2. Weekly leaderboard with rank deltas

**Landing claim:** "WEEKLY LEADERBOARD · resets Sun 11:59pm", "▲3 since Monday" rank-change arrows.

**Task:** Current `/ranking` (RankingPage.jsx + its API) is all-time. Add a weekly view:
- Backend: a `WeeklyScore` model (user, week_start, points) or compute on the fly by
  filtering answered-question/duel events to the current ISO week; expose
  `api/rankings/weekly/` returning rank, user, weekly points, and `rank_delta` vs. the
  user's rank at the start of the week (store a Sunday-night snapshot via a scheduled
  Heroku job or lazily snapshot on first request of a new week).
- Frontend: add a "Weekly" tab to `src/pages/RankingPage.jsx` next to the existing metric
  switcher, with green ▲ / red ▼ delta column and the viewer's own row highlighted.
- No Elo changes; this is a separate points ladder (e.g. 1 pt/correct, duel win bonus).

## 3. Duel streak multiplier + live opponent status

**Landing claim:** "STREAK ×3" badges in duels, "streaks stack bonus points", opponent "answering…" / "ANSWERED · 14s" states, per-question green/red progress segments, avg response time.

**Task:** In the duel flow (`src/pages/DuelBattlePage.jsx` + duel consumers/endpoints in the
Django repo):
- Track consecutive-correct streak per player within a duel; award bonus points
  (e.g. +1 per answer while streak ≥ 3) and show a "STREAK ×N" chip.
- Broadcast opponent answer events over the existing duel channel so each client can show
  "answering…" (pulsing) vs "answered in Ns" per question.
- Render a 10-segment progress bar per player (green = correct, red = miss, violet pulse =
  current question) exactly like the landing hero's duel card.
- Show avg response time per player in the result screen.
Check what the duel websocket already sends before adding events — some of this state may
already exist server-side.

## 4. Rematch after a duel

**Landing claim:** "Rematch satslayer" button; "rematch unlocks after Q10".

**Task:** On `src/pages/BattleResultPage.jsx`, add a "Rematch" button that creates a new
duel room against the same opponent (reuse the existing challenge/room-creation endpoint)
and notifies the opponent (existing notification/invite mechanism if present, else the
waiting-room link). Disable it if the opponent is offline. Backend: accept an optional
`opponent_id` on room creation if it doesn't already.

## 5. Structured AI explanations ("why your pick is wrong" / "the step you skipped")

**Landing claim:** Numbered reasoning steps, a highlighted "THE STEP YOU SKIPPED" box, and a
"WHY [X] IS WRONG" box tailored to the student's wrong pick.

**Task:** Questions currently have a single static `explanation` text. Add an on-demand AI
explanation endpoint in the Django repo (pattern and prompts live in `api/generation.py`,
which already talks to an LLM for question generation; reuse its client/keyless fallback):
`POST api/questions/<id>/explain/` with `{picked_choice}` returns
`{steps: [..], skipped_step, why_wrong}` (cache per question+choice in a small model/table so
each pair is generated once). Frontend: after a miss in the infinite trainer, render the
numbered steps with the amber "step you skipped" box (see `AiExplanations` section in
`HomePage.jsx` for exact styling), falling back to the static explanation when the AI call
fails. Gate behind a feature flag or Premium if cost is a concern.

## 6. Mistake log + weak topics

**Landing claim:** "track every mistake", "saved to your mistake log", "WEAK TOPICS" panel
with per-topic accuracy bars, "watch weak topics shrink".

**Task:** Backend: record every incorrect answer (question, topic/skill tag, timestamp) —
check whether an answered-questions table already exists to derive this from before adding
a model. Expose `api/stats/weak_topics/` returning per-topic accuracy for the user's last
N attempts (topic taxonomy exists in `api/generation.py`). Frontend: add a "Weak topics"
panel to `/trainer` (HomeDashboard) with the colored accuracy bars (red < 60%, orange < 70%,
gold < 80%), plus a mistake-log list view (question, your pick, correct answer, link to
re-attempt). Keep the dashboard quiet per `docs/frontend-design-guidelines.md`.

## 7. "Drill 5 more like this"

**Landing claim:** Link after an explanation that starts a targeted set on the missed topic.

**Task:** Depends on topic tags (see #6). Add a trainer mode that accepts a `topic` query
param (`/infinite_questions?topic=transitions`) and serves only questions with that tag —
the topic-targeting backend may already exist for Premium topic selection; reuse it. Then
add the "Drill 5 more like this →" link to the post-answer explanation panel, passing the
missed question's topic. Free users: allow it but count against the daily 25-question cap.

## 8. Text highlighting on questions — ✅ DONE (July 2026)

Shipped in `PracticeQuestionCard`: a HIGHLIGHT toggle in the card header wraps text
selections in amber `<mark>`s (skips selections crossing KaTeX boundaries; marks clear on
the next question). Available everywhere the shared card renders — practice, diagnostic,
duels, tournaments. The Desmos calculator was already global (`App.jsx`).

## 9. Accuracy vs pacing analytics

**Landing claim:** "ACCURACY VS PACING" panel; "avg 71s target 65s"; insight text like
"your misses cluster in the last 5 questions of each module".

**Task:** Requires per-answer timing (lands with #1). Backend: `api/stats/pacing/`
returning overall accuracy, avg seconds per question vs a target (per subject), and
position-of-miss distribution for full modules. Frontend: add the two labeled progress
bars (green accuracy, orange pacing) to the profile or dashboard stats area. Write the
insight line with simple rules (e.g. if >50% of module misses are in the last 5 questions,
say it's pacing), not an LLM.

## 10. Exam history with "reopen any exam"

**Landing claim:** "EXAM HISTORY" list mixing modules, quick sets, and duels, each reopenable.

**Task:** Partial: practice tests have results pages (`src/pages/practice_test/TestResultPage.jsx`)
and duels have `BattleResultPage`. Verify whether past results are listed anywhere; if not,
add `api/history/` returning the user's past full modules, quick sessions, and duels
(type, date, score, id) and a compact "History" list on the profile page linking each row
to its existing result page. Reuse existing result pages — do not build a new review UI.

## 11. Rating-based matchmaking

**Landing claim:** "get matched with a student at your rating".

**Task:** Verify first — open the matchmaking logic behind `src/pages/MatchingPage.jsx` in
the Django repo. If the queue pairs players randomly, change it to prefer opponents within
±150 duel Elo, widening the band the longer someone waits (e.g. +100 per 10s). Small,
server-side only change; no UI needed beyond maybe "searching near your rating…" text on
the matching screen.

---

### Numbers to keep honest

The landing repeats **1,800+ questions / 400+ students / 25 questions per day / $9.99 Premium**.
If any of these drift, update `HomePage.jsx` (hero, stat rows, pricing, final CTA) — the
figures are hardcoded in several sections.
