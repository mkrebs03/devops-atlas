---
title: The Git model
description: Read commits, branches and references as a map of decisions.
type: concept
level: beginner
module: collaboration
tools: [git]
estimatedTime: 35 minutes
prerequisites: [linux-cli]
---

## Three objects explain most of it

Git stores connected snapshots:

- A **commit** describes a state and points to its parent.
- A **branch** is a moving reference that names a line of commits.
- `HEAD` tells you where you are working now.

You can inspect the map without changing it:

```bash
git status
git log --oneline --graph --decorate --all
git show --stat HEAD
```

## The diff is the unit of conversation

Before saving a commit, review what changed:

```bash
git diff
git diff --cached
```

The first command shows unstaged changes. The second shows exactly what will enter the next commit. That distinction keeps an accidental fix from travelling unseen.

## Commits that help

A useful commit answers one question: “what changed and why?”. Prefer several small changes over one huge change. A message such as `fix: handle empty config` communicates intent; `changes` does not.

:::tip Reversibility rule
If you cannot explain how to undo a commit, it probably contains more than one decision.
:::

## Remotes and trust

A remote points to another repository copy. `fetch` brings information in; `pull` combines that information with your local branch. Separating the two makes it visible when you are reading and when you are integrating.

```bash
git fetch origin
git log --oneline HEAD..origin/main
```
