---
title: Lab · safe branches
description: Practise a small branch, review its diff and undo it without losing the work.
type: lab
level: beginner
module: collaboration
tools: [git]
estimatedTime: 25 minutes
prerequisites: [git-model]
---

## Goal

Create a temporary repository, make a change on a branch and inspect the history before integrating it.

## Step 1 · prepare the map

```bash
mkdir -p /tmp/atlas-git-lab
cd /tmp/atlas-git-lab
git init --initial-branch=main
printf '# Atlas lab\n' > README.md
git add README.md
git commit -m 'docs: start atlas lab'
```

## Step 2 · isolate one intention

```bash
git switch -c feat/add-signal
printf '\nStatus: learning\n' >> README.md
git diff
git add README.md
git commit -m 'docs: add learning signal'
```

The commit should contain only the change you intended to explain.

## Step 3 · integrate and verify

```bash
git switch main
git merge --ff-only feat/add-signal
git log --oneline --graph --decorate --all
```

## Verification

The history should show two commits and `README.md` should include `Status: learning`. To practise rollback without deleting the branch:

```bash
git revert HEAD
git log --oneline --graph --decorate --all
```

:::tip Reverting is delivery too
`git revert` creates a new decision that undoes another. It is safer than rewriting shared history.
:::

## Cleanup

```bash
rm -rf /tmp/atlas-git-lab
```
