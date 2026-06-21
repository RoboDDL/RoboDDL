# RoboDDL

> Helping robotics researchers track conference deadlines through collaboration.

[![LICENSE](https://img.shields.io/github/license/RoboDDL/RoboDDL)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/RoboDDL/RoboDDL/.github/workflows/deploy.yml?branch=main)](https://github.com/RoboDDL/RoboDDL/actions/workflows/deploy.yml)
[![Open PRs](https://img.shields.io/github/issues-pr/RoboDDL/RoboDDL)](https://github.com/RoboDDL/RoboDDL/pulls)

English | [简体中文](./README.zh-CN.md)

RoboDDL is a deadline tracker for robotics conferences and strong journals, inspired by [ccf-ddl](https://github.com/ccfddl/ccf-deadlines).

Contribution and collaboration guidelines live in [`CONTRIBUTING.md`](./CONTRIBUTING.md).
Please fork the repository, base your work on the `dev` branch, and open PRs against `dev`. If you're not making code or data changes, opening an issue with the source link and the field that needs fixing is still hugely helpful.

## Deployments

- Production site: https://roboddl.com
- Dev preview: https://dev.roboddl.com

## Highlights

- 🤖 Conference deadline tracking and a recommended journal list
- ⏳ Deadline display normalized by venue type, with countdowns computed from each stored timezone
- 🧭 Estimated deadlines when a new official paper deadline has not been announced yet
- 🔎 Venue filters for `Conference` and `Journal`
- ⭐ One-click follow with local persistence and favorite-first sorting
- 🗓️ A month-by-month submission overview for upcoming conference deadlines
- 📊 Journal-specific rating display using `CCF / CAAI / CAS / JCR` when available

## Data

- The source-of-truth venue data lives in [`src/data/conference`](./src/data/conference) and [`src/data/journal`](./src/data/journal)
- Conference venues use official deadlines when available, otherwise the site estimates the next cycle from the latest known paper deadline
- Journal venues are shown as rolling-submission targets with rating metadata when available

## Notes

- 🌍 Deadlines are stored with explicit source timezones; the UI currently displays `RAS` venues in `PST` and other venues in `AoE`
- 🛠️ Most updates should only require editing a single venue YAML file
- 🛡️ Invalid venue YAML files are skipped instead of crashing the whole site, and the same format check runs in the local pre-commit hook and fallback deploy workflow
- 🧪 Development workflow, project structure, Issue guide, and PR guide live in [`CONTRIBUTING.md`](./CONTRIBUTING.md)
