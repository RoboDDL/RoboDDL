# RoboDDL

> Helping robotics researchers track conference and journal deadlines through collaboration.

[![LICENSE](https://img.shields.io/github/license/RoboDDL/RoboDDL)](https://github.com/RoboDDL/RoboDDL/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/RoboDDL/RoboDDL/.github/workflows/deploy.yml?branch=main)](https://github.com/RoboDDL/RoboDDL/actions/workflows/deploy.yml)
[![Open PRs](https://img.shields.io/github/issues-pr/RoboDDL/RoboDDL)](https://github.com/RoboDDL/RoboDDL/pulls)

English | [简体中文](https://translate.google.com/translate?sl=auto&tl=zh-CN&u=https://github.com/RoboDDL/RoboDDL)

RoboDDL is a deadline tracker for robotics conferences and strong journals, inspired by [ccf-ddl](https://github.com/ccfddl/ccf-deadlines).

Contribution and collaboration guidelines live in [`CONTRIBUTING.md`](/home/zdj/.openclaw/workspace/roboddl/CONTRIBUTING.md).

## Highlights

- 🤖 Conference deadline tracking for ICRA, IROS, RSS, CoRL, ICML, NeurIPS, ICLR, AAAI, and AAMAS
- 📚 Journal tracking for Science Robotics, T-RO, IJRR, RA-L, T-ASE, and T-FR
- ⏳ AoE-normalized deadline display and countdowns
- 🧭 Estimated deadlines when a new official paper deadline has not been announced yet
- 🔎 Venue filters for `Conference` and `Journal`
- ⭐ One-click follow with local persistence and favorite-first sorting
- 🗓️ A month-by-month submission overview for upcoming conference deadlines
- 📊 Journal-specific rating display using `CCF / CAAI / CAS / JCR` when available

## Data

- The source-of-truth data file is [`src/data/venues.json`](/home/zdj/.openclaw/workspace/roboddl/src/data/venues.json)
- Conference venues use official deadlines when available, otherwise the site estimates the next cycle from the latest known paper deadline
- Journal venues are shown as rolling-submission targets with rating metadata when available

## Notes

- 🌍 All displayed deadlines are normalized to AoE
- 🛠️ Most updates should only require editing the JSON data file
- 🧪 Development workflow, project structure, Issue guide, and PR guide live in [`CONTRIBUTING.md`](/home/zdj/.openclaw/workspace/roboddl/CONTRIBUTING.md)
