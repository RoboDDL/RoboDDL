# Contributing to RoboDDL

## Scope

Most contributions should update venue metadata rather than app logic.

Primary source-of-truth file:

- [`src/data/venues.json`](/home/zdj/.openclaw/workspace/roboddl/src/data/venues.json)

## Before you open a PR

- Keep the change focused
- Prefer data-only edits when possible
- Verify every deadline, rating, or venue link with a source
- Run `npm run build`
- If UI changed, check desktop and a narrow mobile viewport

## Data update rules

For conferences:

- Use `submissionModel: "deadline"`
- Add or update `knownEditions`
- Include `paperDeadline`, `timezone`, `conferenceDates`, `location`, and source links
- If the next edition is not announced, keep the latest official edition and let the site estimate the next cycle

For journals:

- Use `submissionModel: "rolling"`
- Fill `ccfRank`, `caaiRank`, `casPartition`, and `jcrQuartile` when known
- Use `"N/A"` when the metric is not publicly available or the venue is not listed

## Issue guide

Open an issue when:

- A deadline is wrong or missing
- A venue should be added or removed
- A rating source changed
- The UI breaks on desktop or mobile
- A source link is dead or outdated

Include:

- Venue name
- Wrong field
- Source URL
- Date checked
- Screenshot if the issue is visual

Good issue titles:

- `Update ICRA 2027 paper deadline`
- `Add official NeurIPS 2026 CFP`
- `Fix mobile overflow in sticky filter panel`

## PR guide

In your PR description, include:

- What changed
- Why it changed
- Source links used
- Whether the change is data-only or UI + data

Suggested checklist:

- [ ] I updated `src/data/venues.json` when changing venue metadata
- [ ] I added or updated source links
- [ ] I ran `npm run build`
- [ ] I checked the affected UI if I changed layout or styling
