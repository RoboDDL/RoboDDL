# RoboDDL

RoboDDL is a deadline tracker for robotics conferences and strong journals. It is inspired by `ccf-deadlines`, but keeps the source-of-truth venue data in a readable JSON file so contributors can update deadlines, ratings, and metadata without touching React code unless the UI actually changes.

## What the site includes

- Conference deadline tracking for ICRA, IROS, RSS, CoRL, ICML, NeurIPS, ICLR, AAAI, and AAMAS
- Journal tracking for Science Robotics, T-RO, IJRR, RA-L, T-ASE, and T-FR
- AoE-normalized deadline display and countdowns
- Estimated deadlines when a new official paper deadline has not been announced yet
- Venue filters for `Conference` and `Journal`
- One-click follow for venues with local persistence and favorite-first sorting
- A month-by-month submission overview for upcoming conference deadlines
- Journal-specific rating display using `CCF / CAAI / CAS / JCR` when available

## Project structure

- Data file: [`src/data/venues.json`](/home/zdj/.openclaw/workspace/roboddl/src/data/venues.json)
- Venue normalization logic: [`src/data/conferences.ts`](/home/zdj/.openclaw/workspace/roboddl/src/data/conferences.ts)
- Time conversion helpers: [`src/utils/dateUtils.ts`](/home/zdj/.openclaw/workspace/roboddl/src/utils/dateUtils.ts)
- Main page: [`src/App.tsx`](/home/zdj/.openclaw/workspace/roboddl/src/App.tsx)

## Local development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Data editing guide

Most contribution work should only require editing [`src/data/venues.json`](/home/zdj/.openclaw/workspace/roboddl/src/data/venues.json).

For conferences:

- Use `submissionModel: "deadline"`
- Add at least one `knownEditions` entry with `paperDeadline`, `timezone`, `conferenceDates`, `location`, and source links
- If the next edition is not announced, keep the latest official edition and let the app estimate the next cycle automatically
- Add `caaiRank` when you have a confident source

For journals:

- Use `submissionModel: "rolling"`
- Fill `ccfRank`, `caaiRank`, `casPartition`, and `jcrQuartile` when known
- Use `"N/A"` when the journal is not listed or the metric is not available

## Issue guide

Open an issue when:

- A deadline is wrong or missing
- A venue should be added or removed
- A rating source changed
- The UI breaks on desktop or mobile
- A source link is dead or outdated

When filing an issue, include:

- The venue name
- The exact field that looks wrong
- A source URL
- The date you checked it
- A screenshot if the problem is visual

Good issue title examples:

- `Update ICRA 2027 paper deadline`
- `Add official NeurIPS 2026 CFP`
- `Fix mobile overflow in monthly calendar`

## PR guide

Before opening a PR:

- Keep changes focused
- Prefer editing the JSON data file over changing app logic
- Verify every changed deadline or rating with a source
- Run `npm run build`

In the PR description, include:

- What changed
- Why it changed
- Which source links were used
- Whether the change is data-only or UI + data

Suggested PR checklist:

- [ ] I updated `src/data/venues.json` when changing venue metadata
- [ ] I added or updated source links
- [ ] I ran `npm run build`
- [ ] I checked the affected UI on a narrow viewport when UI was changed

## Notes

- All displayed deadlines are normalized to AoE
- If a future deadline is not officially available, the site estimates it from the latest known paper deadline
- Some journal ratings may remain `N/A` when the venue is not clearly listed in the public source used by the project
