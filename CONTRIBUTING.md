# Contributing to RoboDDL

## Scope

Most contributions should update venue metadata rather than app logic.

Primary source-of-truth directories:

- [`src/data/conference`](./src/data/conference)
- [`src/data/journal`](./src/data/journal)

## Project structure

- Conference data: [`src/data/conference`](./src/data/conference)
- Journal data: [`src/data/journal`](./src/data/journal)
- Venue file loader: [`src/data/loadVenueRecords.ts`](./src/data/loadVenueRecords.ts)
- Venue normalization logic: [`src/data/conferences.ts`](./src/data/conferences.ts)
- Time conversion helpers: [`src/utils/dateUtils.ts`](./src/utils/dateUtils.ts)
- Main page: [`src/App.tsx`](./src/App.tsx)

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

## YAML format rules

This repo uses a small custom parser in [`src/data/loadVenueRecords.ts`](./src/data/loadVenueRecords.ts), so the venue files must stay very simple:

- Quote all string values with double quotes. Example: `title: "ICRA"`.
- Keep numeric values unquoted when they are really numbers. Example: `year: 2027`.
- Use spaces for indentation, not tabs.
- Do not add YAML comments inside venue files. Lines starting with `#` are not supported by the parser.
- Do not use YAML features such as anchors, inline objects, or complex multiline syntax.
- Keep `venueType: "conference"` files in `src/data/conference` and `venueType: "journal"` files in `src/data/journal`.

There are a few logic rules worth knowing before editing:

- For conference venues, the newest official item in `knownEditions` is the fallback reference used to estimate future deadlines when the next CFP is not published yet.
- Conference venues are assumed to be annual unless you set `cycleYears`. Use `cycleYears: 2` for biennial venues such as `ECCV`.
- `futureHints` is optional and is only used to fill in future conference date, location, and landing page when the next deadline is still estimated.
- `abstractDeadline` is optional. If it exists and is still in the future, the countdown will target the abstract deadline first.
- Supported timezones come from [`src/utils/dateUtils.ts`](./src/utils/dateUtils.ts): `AoE`, `PST`, `PDT`, `EST`, `EDT`, `UTC`, `GMT`, and `UTC±HH[:MM]`.
- `rank` is a display label. Existing conference files use values like `"A*"`, `"A"`, or `"RAS A"`. Existing journal files usually use `"Top Journal"`.

## Venue YAML templates

These templates are intentionally copy-paste safe. If an optional field does not apply, delete the whole line or block rather than leaving a fake placeholder in the final file.

Conference template:

```yaml
slug: "venue-slug"
title: "VENUE"
fullTitle: "Full Conference Title"
summary: "One-sentence summary of the venue scope and why it belongs in RoboDDL."
venueType: "conference"
category: "RAS"
rank: "A"
coreRank: "A*"
caaiRank: "A"
homepage: "https://series-homepage.example.com/"
dblp: "conf/example"
keywords:
  - "keyword 1"
  - "keyword 2"
  - "keyword 3"
submissionModel: "deadline"
cycleYears: 1
knownEditions:
  - year: 2027
    paperDeadline: "2026-09-15T23:59:59"
    abstractDeadline: "2026-09-08T23:59:59"
    timezone: "AoE"
    conferenceDates: "May 20-24, 2027"
    location: "City, Country"
    link: "https://2027.venue.example.com/"
    deadlineSourceLabel: "VENUE 2027 Call for Papers"
    deadlineSourceUrl: "https://2027.venue.example.com/call-for-papers/"
    note: "Optional extra context shown on the card, for example a timezone assumption."
futureHints:
  - year: 2028
    conferenceDates: "May 18-22, 2028"
    location: "Another City, Country"
    link: "https://future-meetings.example.com/"
    note: "Optional future-meeting note."
```

Conference template notes:

- Required top-level fields are `slug`, `title`, `fullTitle`, `summary`, `venueType`, `category`, `rank`, `homepage`, `submissionModel`, and `knownEditions`.
- `cycleYears`, `coreRank`, `caaiRank`, `dblp`, `keywords`, `abstractDeadline`, `note`, and `futureHints` are optional.
- `knownEditions` should contain official historical or current editions, not guesses. Keep the newest official edition even after its deadline passes, because future estimation depends on it.
- Omit `cycleYears` for normal annual venues. Set `cycleYears: 2` only when the series is intentionally not annual.
- Use the official CFP or official venue page for `deadlineSourceUrl`. Avoid blog posts, reminder sites, or reposted deadline aggregators.
- Use the real local deadline plus the correct `timezone`. The app will convert it to AoE for display.
- Today the app only exposes `RAS`, `AI x Robotics`, and `Journal` in filters. For conferences, use one of the existing conference categories unless you are also updating the filtering logic.

Journal template:

```yaml
slug: "journal-slug"
title: "Journal Short Name"
fullTitle: "Full Journal Title"
summary: "One-sentence summary of the journal's robotics relevance and positioning."
venueType: "journal"
category: "Journal"
rank: "Top Journal"
caaiRank: "A"
ccfRank: "B"
casPartition: "CAS 2"
jcrQuartile: "Q1"
homepage: "https://journal-homepage.example.com/"
dblp: "journals/example"
keywords:
  - "journal keyword 1"
  - "journal keyword 2"
submissionModel: "rolling"
rollingNote: "Rolling submission. Manuscripts are handled continuously."
sourceLabel: "Official journal page"
sourceUrl: "https://journal-homepage.example.com/"
specialIssueLabel: "Special Issue"
specialIssueUrl: "https://journal-homepage.example.com/special-issue"
```

Journal template notes:

- Required top-level fields are `slug`, `title`, `fullTitle`, `summary`, `venueType`, `category`, `rank`, `homepage`, `submissionModel`, `rollingNote`, `sourceLabel`, and `sourceUrl`.
- `dblp`, `keywords`, `specialIssueLabel`, and `specialIssueUrl` are optional.
- Prefer keeping `caaiRank`, `ccfRank`, `casPartition`, and `jcrQuartile` present. If a metric is unknown or not listed, set it to `"N/A"` instead of removing it.
- `sourceUrl` should point to an official journal page or publisher page that supports the rolling-submission claim.
- If a journal currently has a live special issue or special collection page that contributors should know about, add both `specialIssueLabel` and `specialIssueUrl`. If not, omit both lines.

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

- [ ] I updated the affected file in `src/data/conference` or `src/data/journal` when changing venue metadata
- [ ] I added or updated source links
- [ ] I ran `npm run build`
- [ ] I checked the affected UI if I changed layout or styling
