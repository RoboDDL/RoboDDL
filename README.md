# RoboDDL

RoboDDL is a deadline tracker for robotics conferences and strong journals. It is inspired by `ccf-deadlines`, but keeps the source-of-truth venue data in a readable JSON file so contributors can update deadlines, ratings, and metadata without touching React code unless the UI actually changes.

Contribution and collaboration guidelines live in [`CONTRIBUTING.md`](/home/zdj/.openclaw/workspace/roboddl/CONTRIBUTING.md).

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

## Notes

- All displayed deadlines are normalized to AoE
- If a future deadline is not officially available, the site estimates it from the latest known paper deadline
- Some journal ratings may remain `N/A` when the venue is not clearly listed in the public source used by the project
