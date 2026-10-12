---
title: Practice · safe branches
description: Version the sample application, resolve a conflict, undo a merge, and open your first pull request.
type: practice
module: collaboration
tools: [git, github]
prerequisites: [collaboration.git-model]
---

:::note[Written walkthrough, not run end to end]
I have not run this walkthrough from start to finish. The output shown is illustrative and may differ from yours. If a step does not work, [open an issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## End state

`myapp` inside a repository with a readable history — a merge, a resolved conflict, and a revert — published on GitHub with one pull request merged. That remote repository is the one the server and continuous integration walkthroughs use.

## Requirements

- Git configured with your name and email.
- The `~/myapp` folder from the [previous walkthrough](/en/foundations/lab-shell-and-network/). If you do not have it, create it with the `server.js` from [The sample application](/en/sample-app/#the-file).
- A GitHub account, for steps 5 and 6.
- About 25 minutes.

## Step 1 · The first commit

```bash
cd ~/myapp
git init --initial-branch=main
printf 'node_modules/\n.env\n' > .gitignore
git add server.js .gitignore
git commit -m 'feat: add myapp server'
```

**Signal:** `git status` reports nothing to commit, and `git log --oneline` shows one commit.

## Step 2 · One isolated intention

```bash
git switch -c docs/readme
printf '# myapp\n\nMinimal HTTP server. Start it with `node server.js`.\n' > README.md
git add README.md
git diff --cached              # exactly what is going into the commit
git commit -m 'docs: add readme'
git switch main
git merge --ff-only docs/readme
```

**Signal:** the merge answers `Fast-forward`. `main` had not moved, so Git only advanced the reference: there is no merge commit because there were no two lines to join.

## Step 3 · Cause and resolve a conflict

Make two branches change the same line:

```bash
printf 'PORT=8080\n' > .env.example
git add .env.example           # new file: -a would not include it
git commit -m 'chore: document PORT in env example'

git switch -c chore/port-3000
printf 'PORT=3000\n' > .env.example
git commit -am 'chore: default port 3000'

git switch main
printf 'PORT=8081\n' > .env.example
git commit -am 'chore: default port 8081'

git merge chore/port-3000      # CONFLICT in .env.example
```

Open `.env.example`. Git left both versions between markers:

```text
<<<<<<< HEAD
PORT=8081
=======
PORT=3000
>>>>>>> chore/port-3000
```

Edit it down to a single line — `PORT=3000`, for instance — with no markers, and close the merge:

```bash
git add .env.example
git commit --no-edit
```

**Signal:** `git log --oneline --graph` draws two lines that split and join again in a `Merge branch 'chore/port-3000'` commit.

## Step 4 · Undo without rewriting

Suppose that merge was a mistake. Instead of erasing it, you revert it with a new commit.

```bash
git revert -m 1 --no-edit HEAD
git log --oneline --graph
cat .env.example
```

`-m 1` tells Git which side of the merge to keep: the first one, which is the `main` line. `--no-edit` accepts the proposed message instead of opening an editor.

**Signal:** there is a new commit `Revert "Merge branch 'chore/port-3000'"`, the merge is still visible below it, and the file says `PORT=8081` again.

:::tip[Why revert and not reset]
`git revert` creates a new decision that undoes another. It is preferable to rewriting shared history with `reset --hard`, because whoever already had those commits does not end up with a different history from yours.
:::

## Step 5 · Publish it

Create an empty repository named `myapp` on GitHub — no README and no licence, so it has no history of its own — and connect it:

```bash
git remote add origin git@github.com:YOUR_USER/myapp.git
git push -u origin main
```

`-u` links your local branch to the remote one, so later `git push` and `git pull` calls need no arguments.

**Signal:** the repository page shows `server.js`, and `git status` says your branch is up to date with `origin/main`.

## Step 6 · Your first pull request

```bash
git switch -c docs/routes
printf '\n## Routes\n\n- `/` returns the version.\n- `/health` returns the status.\n' >> README.md
git commit -am 'docs: list routes'
git push -u origin docs/routes
```

The `push` output includes a link to open the pull request. Open it, write what changes and how you checked it, and merge it from the web. Then bring the result back:

```bash
git switch main
git pull --ff-only
git branch -d docs/routes
```

**Signal:** `git log --oneline` on `main` includes the README change, and `git branch -d` deletes the branch without complaint because it is already merged.

## When something does not add up

| Symptom | What happened | What to do |
| --- | --- | --- |
| `git commit` says there are unmerged paths | The conflict is not marked as resolved | `git add .env.example` |
| The merge is half done and you want to start over | You are still inside the merge | `git merge --abort` |
| `push` rejected with `Permission denied (publickey)` | GitHub does not know your SSH key | Add it to your account, or use the repository's `https://` URL |
| `push` rejected with `fetch first` | The remote has commits you do not | You created it with a README: `git pull --rebase origin main` |

## Cleanup

Local branches that are already merged can go:

```bash
git branch -d docs/readme chore/port-3000
```

**Keep `~/myapp` and the GitHub repository**: the remaining walkthroughs carry on from there.
