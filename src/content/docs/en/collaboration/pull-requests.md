---
title: Pull requests and review
description: Proposing a change, explaining it, and reviewing it before it enters the shared branch.
type: tool
level: beginner
module: collaboration
tools: [git, github]
prerequisites: [collaboration.git-model]
learningObjectives:
  - Follow a change from a working branch through integration.
  - Prepare a pull request that makes intent and evidence visible.
  - Apply review and branch protections to integrate safely.
takeaways:
  - Working branches isolate one concrete intention for a short time.
  - A useful pull request makes a change easier to understand, verify, and revert.
  - Protections and review turn main into a state you can trust.
---

## The route of a change

```mermaid
flowchart LR
  M["main"] --> B["branch"] --> C["commits"] --> P["pull request"] --> R["review + CI"] --> Mg["merge"]
  Mg --> M
```

The main branch represents the state a team is willing to share. A working branch creates temporary space for one concrete intention.

```bash
git switch main
git pull --ff-only
git switch -c feat/health-check
```

This route — a short branch that returns to `main` quickly — is not the only way to organise a project's branches, but it is the simplest one, and the one worth keeping until you have a reason for something else. What those reasons are gets decided later, in [Branching strategies](/en/integration/branching-strategy/), once you know what a deployment costs.

## Pull requests as conversation

A pull request is not only a merge button. It is a surface for explaining:

1. Which problem the change solves.
2. Which decisions the implementer made.
3. How the change was verified.
4. Which risk remains.

An **issue** is the unit that records outstanding work — a reported bug, an agreed improvement — with its discussion and its number. Link the issue that motivates the change (for example, with `Closes #42`, which also closes it on merge) so that context travels with the code. The description and diff should make a review specific: "the endpoint returns 503 when the dependency is missing, and the test covers that case" helps more than "looks good".

## Reviewing is reading with intent

A reviewer does not chase formatting errors —automation does that. They look for three things:

- **Correctness**: does the change do what it says and cover the edge cases?
- **Scope**: does the diff contain a single intention?
- **Reversibility**: can it be undone without dragging other things along?

Requesting changes is not a rejection, it is part of the conversation. A small PR gets truly reviewed; a huge one gets approved at a glance, which is worse.

## CI and protected branches

**CI** stands for continuous integration: every proposed change is integrated and validated automatically on a clean server, not only on the machine of whoever wrote it. That automation removes the repetitive checks — formatting, types, tests, and builds. When a check fails, its status should be actionable and point to evidence.

A **protected branch** turns those agreements into rules: require at least one review, require CI to pass and prevent pushing directly to `main`. That way the only gate into the shared state is a change that was reviewed and verified.

:::caution[Do not mix cleanup with a feature]
A pull request that changes behaviour, renames files and reformats the whole project costs more to review. Split the intent so the signal stays clear.
:::

## Check your understanding

<details>
<summary>Your PR touches 40 files: the feature and a massive reformat. Why is that a problem?</summary>

Because it mixes two intentions and the review loses signal: the real changes hide among thousands of lines of formatting. Split them into two PRs (or two clear commits) so each decision can be reviewed and reverted on its own.

</details>

<details>
<summary>CI fails on your PR and the branch is protected. Can you merge anyway?</summary>

No, and that is the point: the protection requires checks to pass before integrating into main. Fix the cause —the status should point to the evidence— and re-run; only then is the merge enabled.

</details>

## Keep exploring

- [Pull requests (official documentation)](https://docs.github.com/en/pull-requests) — the full reference for the proposal and review surface.
- [Conventional Commits](https://www.conventionalcommits.org/) — structured commit messages.
- [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches) — rules to protect main.
