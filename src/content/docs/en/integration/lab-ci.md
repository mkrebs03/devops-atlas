---
title: Practice · a test and a workflow
description: Write a test that fails, make it pass, and let a workflow run it and build the image on every change.
type: practice
module: integration
tools: [node, github-actions, docker, github]
prerequisites: [integration.github-actions, integration.tests-in-ci, containers.lab-container-pipeline]
---

:::note[Written walkthrough, not run end to end]
I have not run this walkthrough from start to finish. The output shown is illustrative and may differ from yours. If a step does not work, [open an issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## End state

`myapp` with an automated test, a new route born from that test, and a workflow that on every pull request runs the suite, builds the image, and checks that the container answers. And `main` protected so nothing gets in without going through it.

## Requirements

- Node 18 or later.
- The `myapp` repository on GitHub with the `Dockerfile` from the [previous walkthrough](/en/containers/lab-container-pipeline/).
- About 30 minutes.

## Step 1 · A test that fails

The application is going to gain a `/version` route. What it must do gets written first:

```bash
cd ~/myapp
git switch main && git pull --ff-only
git switch -c feat/version

cat > server.test.js <<'EOF'
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const server = require('./server.js');

let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  server.closeAllConnections();
});

test('GET /health answers ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('GET /version returns the deployed version', async () => {
  const res = await fetch(`${base}/version`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { version: 'dev' });
});
EOF

node --test
```

The test imports `server.js` and brings it up on port `0`, which means "whichever is free": that way it collides with nothing already running on your machine or on the runner.

**Signal:** one test passes and the other fails with `404 !== 200`. That is the right failure: the route does not exist yet. Had it failed on a syntax or import error, the test would be saying nothing about `/version`.

## Step 2 · Make it pass

Open `server.js` and add the route just before the `/` block:

```js
  if (req.url === '/version') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ version }) + '\n');
  }
```

```bash
node --test
```

**Signal:** `pass 2`, `fail 0`. The test did not change between red and green; the code did.

## Step 3 · The workflow

```bash
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'EOF'
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: node --test

  image:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build the image
        run: docker build --tag myapp:ci .
      - name: Smoke test
        run: |
          docker run --detach --name myapp --publish 8080:8080 myapp:ci
          curl --fail --silent --show-error \
            --retry 5 --retry-delay 1 --retry-all-errors \
            http://127.0.0.1:8080/health
EOF
```

Two jobs, ordered from cheap to expensive. `test` takes seconds and runs the suite. `image` only starts if `test` passed: it builds the image and does what you did by hand in the previous walkthrough, asking the container for `/health`. `--retry` gives the process room to finish starting.

The actions are referenced by tag (`@v4`) so the file reads easily. In a real repository they are pinned by SHA, for the reason given in [Secrets and permissions](/en/integration/secrets/).

## Step 4 · Watch it run

```bash
git add server.js server.test.js .github/workflows/ci.yml
git commit -m 'feat: add version route with test and ci'
git push -u origin feat/version
```

Open the pull request. Both jobs show up in the **Checks** tab.

**Signal:** `test` and then `image` finish green, and the pull request shows them next to the merge button. Merge it.

## Step 5 · Break it on purpose

A workflow you have never seen fail is an assumption. Change the behaviour without touching the test:

```bash
git switch main && git pull --ff-only
git switch -c chore/break-health
```

In `server.js`, change `{"status":"ok"}` to `{"status":"up"}`. Then:

```bash
git commit -am 'chore: rename health status'
git push -u origin chore/break-health
```

Open the pull request.

**Signal:** `test` finishes red and `image` never even starts. Open the failed job: the log shows the test name, the expected value, and the one received. That line is what a teammate would need to fix it without asking you anything.

Close the pull request without merging and delete the branch:

```bash
git switch main
git branch -D chore/break-health
git push origin --delete chore/break-health
```

## Step 6 · Make it decide, not inform

So far the workflow warns, but nothing stops a red merge. In the repository, go to **Settings → Branches**, add a rule for `main`, and require the `test` and `image` checks to pass before merging.

**Signal:** on a pull request whose checks are red or still running, the merge button is blocked.

## When something does not add up

| Symptom | Likely cause | What to look at |
| --- | --- | --- |
| The new test passes without touching the code | It does not assert what you think | The `assert` calls |
| `Cannot find module './server.js'` | You are running the test from another folder | `pwd` |
| `node --test` never finishes | The server was left open | The `after` block |
| The workflow does not show up on GitHub | The file is not under `.github/workflows/` | The path and the `.yml` extension |
| `image` fails at the smoke test | The container does not listen on `0.0.0.0` | `ENV HOST` in the `Dockerfile` |
| You cannot find `test` when creating the rule | The check has not run in that repository yet | Wait for one run to finish |

## Cleanup

Nothing to delete: the workflow, the test, and the branch rule are the result. The [promote and roll back](/en/deployment/lab-release/) walkthrough uses the image this repository builds.
