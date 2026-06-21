# RoboDDL

> 一站式机器人会议和期刊截止日期追踪

[![LICENSE](https://img.shields.io/github/license/RoboDDL/RoboDDL)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/RoboDDL/RoboDDL/.github/workflows/deploy.yml?branch=main)](https://github.com/RoboDDL/RoboDDL/actions/workflows/deploy.yml)
[![Open PRs](https://img.shields.io/github/issues-pr/RoboDDL/RoboDDL)](https://github.com/RoboDDL/RoboDDL/pulls)

[English](./README.md) | 简体中文

RoboDDL 用来整理机器人方向的会议 deadline 和一些强相关期刊信息，项目灵感来自 [ccf-ddl](https://github.com/ccfddl/ccf-deadlines)。

贡献方式见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。开发前请先 fork 仓库，并且基于 `dev` 分支开新分支；PR 也请提到 `dev`。如果只是报错，开个 issue，把来源链接和需要改的字段写清楚就很好。

## 部署

- 正式版：https://roboddl.com
- 开发版：https://dev.roboddl.com

## 亮点

- 🤖 会议 deadline 追踪，以及一份机器人相关期刊列表
- ⏳ 按会议类型统一显示截止时间，倒计时会根据数据里的时区计算
- 🧭 新一届官方 deadline 还没公布时，会先根据最近一届 paper deadline 做估算
- 🔎 可以按 `Conference` 和 `Journal` 筛选
- ⭐ 支持一键收藏，收藏记录保存在本地，也会优先排序
- 🗓️ 按月份查看接下来要截止的会议投稿
- 📊 期刊信息里会尽量展示 `CCF / CAAI / CAS / JCR` 等评级

## 数据

- 数据文件在 [`src/data/conference`](./src/data/conference) 和 [`src/data/journal`](./src/data/journal)
- 会议优先使用官方公布的 deadline；没有新消息时，页面会用最近一届数据估算下一轮
- 期刊按滚动投稿处理，并尽量补充评级信息

## 说明

- 🌍 每条 deadline 都会记录来源时区；目前页面里 `RAS` venue 显示为 `PST`，其他 venue 显示为 `AoE`
- 🛠️ 日常更新通常只需要改一个 venue YAML 文件
- 🛡️ 格式有问题的 YAML 会被跳过，不会拖垮整个站点；本地 pre-commit hook 和备用部署流程都会跑同一套格式检查
- 🧪 开发流程、项目结构、Issue 和 PR 说明都在 [`CONTRIBUTING.md`](./CONTRIBUTING.md)
