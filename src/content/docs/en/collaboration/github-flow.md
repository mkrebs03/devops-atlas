---
title: GitHub Flow
description: A small flow for proposing, reviewing and delivering changes with context.
type: tool
level: beginner
module: collaboration
tools: [git, github, pull-requests]
estimatedTime: 30 minutes
prerequisites: [git-model]
---

## The flow in five movements

```text
main → branch → commit → pull request → merge
```

The main branch represents the state a team is willing to share. A working branch creates temporary space for one concrete intention.

```bash
git switch main
git pull --ff-only
git switch -c feat/health-check
```

## Pull requests as conversation

A pull request is not only a merge button. It is a surface for explaining:

1. Which problem the change solves.
2. Which decisions the implementer made.
3. How the change was verified.
4. Which risk remains.

The description and diff should make a review specific. “Looks good” helps less than “the endpoint returns `503` when the dependency is missing, and the test covers that case”.

## CI as a participant

Automation does not replace human review, but it removes repetitive checks: formatting, types, tests and builds. When a check fails, its status should be actionable and point to evidence.

:::caution Do not mix cleanup with a feature
A pull request that changes behaviour, renames files and reformats the whole project costs more to review. Split the intent so the signal stays clear.
:::
