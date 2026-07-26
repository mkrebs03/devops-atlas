---
title: Practice · safe branches
description: Practise a small branch, review its diff, resolve a conflict and undo it without losing the work.
type: practice
level: beginner
module: collaboration
tools: [git]
prerequisites: [collaboration.git-model]
learningObjectives:
  - Create an isolated change on a branch and inspect its diff before integration.
  - Resolve a simple merge conflict deliberately.
  - Practise a safe way to undo a change without losing work.
takeaways:
  - Reviewing the graph and diff before integration reveals the real scope.
  - A conflict is a decision Git delegates to you, not an error.
  - Git supports going back through explicit and verifiable operations.
---

## Goal

Create a temporary repository, make a change on a branch, cause and resolve a conflict, and inspect the history before trusting it.

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
git diff                       # review the change before saving it
git commit -am 'docs: add learning signal'
git switch main
git merge --ff-only feat/add-signal
```

The commit contains only the change you intended to explain, and the linear merge leaves a clean history.

## Step 3 · cause and resolve a conflict

Make two branches change the same line:

```bash
printf 'timeout = 45\n' > config.txt
git commit -am 'chore: add config with timeout 45'
git switch -c feat/timeout
printf 'timeout = 60\n' > config.txt
git commit -am 'chore: raise timeout to 60'
git switch main
printf 'timeout = 30\n' > config.txt
git commit -am 'chore: lower timeout to 30'
git merge feat/timeout          # CONFLICT in config.txt
```

Open `config.txt`: Git left both versions between the `<<<<<<<`, `=======` and `>>>>>>>` markers. Choose the correct value, remove the markers and close the merge:

```bash
# edit config.txt down to a single line (for example, timeout = 60)
git add config.txt
git commit --no-edit
```

Resolving the conflict is making the decision Git cannot make for you.

## Step 4 · undo safely

```bash
git revert HEAD                 # creates a commit that undoes the previous one
git log --oneline --graph --decorate --all
```

:::tip[Reverting is delivery too]
`git revert` creates a new decision that undoes another. It is safer than rewriting shared history with `reset --hard`.
:::

## Verification

The history should show the merges and the revert as explicit commits, and `git status` should be clean. The checkable assertion is: every change was recorded as a decision you can read and undo.

## Check your understanding

<details>
<summary>You resolved the conflict but forgot to git add the file. Can you close the merge?</summary>

No: while the file is still marked as unresolved, Git will not let you complete the merge. Run `git add config.txt` to mark it resolved, then `git commit` to close the integration.

</details>

## Cleanup

```bash
rm -rf /tmp/atlas-git-lab
```
