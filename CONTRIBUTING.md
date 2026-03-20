# Contributing to RoboDDL

Most contributions to RoboDDL fall into four categories:

- [Data additions and updates](#data-additions-and-updates)
- [Bug fixes](#bug-fixes)
- [Feature requests](#feature-requests)
- [Others](#others)

## Getting started

If you are new to GitHub or local development, this is the easiest way to get RoboDDL running locally.

### 1. Install Git

Install Git so you can clone the repository.

- Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Check that Git works:

```bash
git --version
```

### 2. Install Node.js and npm

RoboDDL uses Node.js for local development. The official Node.js installer already includes `npm`, so you usually do not need to install `npm` separately.

- Download the LTS version: [https://nodejs.org/](https://nodejs.org/)
- Check that both commands work:

```bash
node -v
npm -v
```

### 3. Clone the repository

Before contributing, please **Fork** this repository to your own GitHub account. Then clone your fork and make changes there.

```bash
git clone https://github.com/USERNAME/RoboDDL.git
cd RoboDDL
```

### 4. Install dependencies

```bash
npm install
```

This also installs the repository's `pre-commit` hook automatically.

### 5. Start the local dev server

```bash
npm run dev
```

Vite will print a local URL such as `http://localhost:5173`. Open it in your browser.

### 6. Before opening a PR

Please confirm you are opening the PR from your forked repository.

Make sure the data format and build both pass:

```bash
npm run validate:data
npm run build
```

## Contribution types

### <a id="data-additions-and-updates"></a>Data additions and updates

- Add or update venue metadata in [`src/data/conference`](./src/data/conference) or [`src/data/journal`](./src/data/journal).
- Verify every changed field against an official source.
- If you only need to fix a deadline, source link, rank, or venue metadata, you will usually edit a single YAML file.

### <a id="bug-fixes"></a>Bug fixes

- Use this for broken UI, wrong countdown behavior, parsing issues, layout regressions, or incorrect filtering behavior.
- Include clear reproduction steps, expected behavior, and screenshots if the bug is visual.

### <a id="feature-requests"></a>Feature requests

- Use this for new pages, filters, sorting behavior, data fields, workflow improvements, or larger UX changes.
- Explain the use case and why the feature would help RoboDDL users.

### <a id="others"></a>Others

- Use this for documentation cleanup, refactors, discussion topics, housekeeping, and anything that does not fit the three categories above.

## Quick workflow

1. Fork this repository.
2. Identify which contribution type your change belongs to.
3. Update the relevant files in your fork.
4. Verify sources or behavior.
4. Run:

```bash
npm install
npm run validate:data
npm run build
```

5. If you changed the UI, also check desktop and a narrow mobile viewport.
6. Open a PR from your fork with enough context for review.


## What to edit

- Conference data: [`src/data/conference`](./src/data/conference)
- Journal data: [`src/data/journal`](./src/data/journal)
- Venue loader: [`src/data/loadVenueRecords.ts`](./src/data/loadVenueRecords.ts)
- Conference normalization: [`src/data/conferences.ts`](./src/data/conferences.ts)
- Timezone helpers: [`src/utils/dateUtils.ts`](./src/utils/dateUtils.ts)
- Main UI: [`src/App.tsx`](./src/App.tsx)

## Venue data guide

Venue files are parsed by a small custom loader in [`src/data/loadVenueRecords.ts`](./src/data/loadVenueRecords.ts), so keep them intentionally simple:

- Quote all string values with double quotes. Example: `title: "ICRA"`.
- Keep real numbers unquoted. Example: `year: 2027`.
- Use spaces, not tabs.
- Do not add YAML comments beginning with `#`.
- Do not use advanced YAML features such as anchors, inline objects, or complex multiline syntax.
- Keep `venueType: "conference"` files in `src/data/conference` and `venueType: "journal"` files in `src/data/journal`.
- Delete optional lines that do not apply instead of leaving placeholder content behind.
- Run `npm run validate:data` after editing YAML. CI and deploy both use the same check.
- `npm install` also installs a `pre-commit` hook that runs the same YAML validation locally.

Supported timezones come from [`src/utils/dateUtils.ts`](./src/utils/dateUtils.ts): `AoE`, `PST`, `PDT`, `EST`, `EDT`, `UTC`, `GMT`, and `UTC±HH[:MM]`.

### Conferences

- Use `submissionModel: "deadline"`.
- Keep `knownEditions` up to date.
- Include `paperDeadline`, `timezone`, `conferenceDates`, `location`, and source links for official editions.
- If the next edition is not announced yet, keep the latest official edition and let the site estimate the next cycle.
- `abstractDeadline` is optional.
- Use `cycleYears: 2` only for non-annual venues such as `ECCV`.
- `futureHints` is optional and only meant for future date/location/link context when the next deadline is still estimated.
- The newest official item in `knownEditions` is the fallback reference for future estimation.
- The app assumes conferences are annual unless `cycleYears` says otherwise.
- If `abstractDeadline` exists and is still in the future, the countdown targets it before `paperDeadline`.

<details>
<summary>Conference template</summary>

```yaml
slug: "venue-slug"
title: "VENUE"
fullTitle: "Full Conference Title"
summary: "One-sentence summary of the venue scope and why it belongs in RoboDDL."
venueType: "conference"
category: "RAS"
ccfRank: "B"
caaiRank: "A"
homepage: "https://series-homepage.example.com/"
dblp: "conf/example"
keywords:
  - "keyword 1"
  - "keyword 2"
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
    note: "Optional extra context shown on the card."
futureHints:
  - year: 2028
    conferenceDates: "May 18-22, 2028"
    location: "Another City, Country"
    link: "https://future-meetings.example.com/"
    note: "Optional future-meeting note."
```

Conference notes:

- Required top-level fields: `slug`, `title`, `fullTitle`, `summary`, `venueType`, `category`, `homepage`, `submissionModel`, `knownEditions`.
- `cycleYears`, `ccfRank`, `caaiRank`, `dblp`, `keywords`, `abstractDeadline`, `note`, and `futureHints` are optional.
- `knownEditions` should contain official editions, not guesses.
- Prefer official CFP or official event pages for `deadlineSourceUrl`.
- Use the real local deadline with the correct `timezone`; the app converts it for display.
- Conference categories should stay aligned with existing filters unless you are also updating the UI logic.
</details>

### Journals

- Use `submissionModel: "rolling"`.
- Fill `ccfRank`, `caaiRank`, `casPartition`, and `jcrQuartile` when known.
- Use `"N/A"` when a metric is unavailable or the venue is not listed.
- `sourceUrl` should support the rolling-submission claim with an official journal or publisher page.
- `specialIssueLabel` and `specialIssueUrl` are optional, but should be added together when relevant.

<details>
<summary>Journal template</summary>

```yaml
slug: "journal-slug"
title: "Journal Short Name"
fullTitle: "Full Journal Title"
summary: "One-sentence summary of the journal's robotics relevance and positioning."
venueType: "journal"
category: "Journal"
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

Journal notes:

- Required top-level fields: `slug`, `title`, `fullTitle`, `summary`, `venueType`, `category`, `homepage`, `submissionModel`, `rollingNote`, `sourceLabel`, `sourceUrl`.
- `dblp`, `keywords`, `specialIssueLabel`, and `specialIssueUrl` are optional.
- Prefer keeping `caaiRank`, `ccfRank`, `casPartition`, and `jcrQuartile` present, using `"N/A"` when needed.
</details>
