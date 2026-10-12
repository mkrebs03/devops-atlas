---
title: Tests in CI
description: Run the suite on every change, with the dependencies it needs, and read coverage without fooling yourself.
type: tool
module: integration
tools: [github-actions, postgresql, docker]
prerequisites: [integration.github-actions, integration.pyramid]
---

## The suite runs on every change

A workflow describes what happens on repository events, as you saw in [GitHub Actions](/en/integration/github-actions/). Tests fit right there: every push and every pull request runs them in a clean environment, not just on your machine.

```mermaid
flowchart LR
  PR["pull request"] --> L["lint"] --> U["unit"] --> I["integration"] --> B["build"] --> H["smoke test"]
```

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

Order from cheap to expensive: lint first (seconds), then unit, then integration. That way the most common failure shows up first, and nobody waits eight minutes to learn a semicolon was missing.

## A database for integration tests

An integration test needs the piece it integrates with. The runner is born empty, so you have to ask for it. `services` starts a container next to the job and destroys it when the job ends:

```yaml
jobs:
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 5s
          --health-retries 10
    env:
      DATABASE_URL: postgres://postgres:postgres@127.0.0.1:5432/postgres
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:integration
```

Two details hold that block up. `--health-cmd` keeps the job from starting until the database accepts connections: it is the same "started is not ready" problem that `depends_on` solves in [Compose](/en/containers/compose/). And the password is written in plain sight because it protects nothing: that database lives for a few minutes, empty, inside a machine that gets destroyed.

Use the same major version as production. A suite that passes against a different engine, or a different version, makes a claim about a system that is not yours.

## Testing the artifact, not just the code

Everything above runs the code with the runner's Node. What gets deployed is something else: an image. Between the two there is room for failures no unit test sees — a file that was not copied, a missing variable, a process listening on the wrong interface.

```yaml
  image:
    needs: [test, integration]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build --tag myapp:ci .
      - run: |
          docker run --detach --publish 8080:8080 myapp:ci
          curl --fail --retry 5 --retry-delay 1 --retry-all-errors http://127.0.0.1:8080/health
```

That is a **smoke test**: start the artifact and ask it for the bare minimum. It does not replace the suite; it checks the one thing the suite cannot.

## Coverage: a compass, not a destination

**Coverage** measures what percentage of the code your tests execute. It is useful for finding untested areas, but misleading as a target: you can have 100% coverage and zero useful assertions. Executing a line is not the same as verifying its behaviour.

Use it to ask what was left untested and why, not to chase a number.

## When CI fails and your machine does not

It is almost always an environment difference, and almost always one of these:

| What you see | Usual cause | What to check |
| --- | --- | --- |
| It fails on install | The lockfile does not match the manifest | That `npm ci` passes locally from a clean folder |
| A test using the time or the zone fails | The runner is in UTC | Pin the zone in the test, not on the machine |
| It fails only sometimes | The test depends on order or on a timeout | Run it alone, repeatedly |
| It cannot find a variable | It existed in your terminal, not in the repository | The job's `env` block |

CI is valuable for exactly that reason: it runs in a clean environment that reveals assumptions you did not know you had.

:::tip[Fail fast, fail clearly]
A CI job that takes 30 minutes discourages the whole team. Parallelise, cache dependencies, and put the fast checks first.
:::

## Check your understanding

<details>
<summary>You have 95% coverage but bugs keep reaching production. How is that possible?</summary>

Coverage only says which lines ran, not whether you asserted on them correctly. You can execute code without checking its result. Make sure each test has meaningful assertions about behaviour, not merely that it passes through.

</details>

<details>
<summary>A test passes on your machine and fails in CI. What is the first suspect?</summary>

An environment difference: unpinned dependencies (use a lockfile and `npm ci`), missing environment variables, or data that existed only on your machine. CI runs clean and that is why it exposes those assumptions.

</details>

<details>
<summary>Every test passes and the container does not start on the server. Which check was missing?</summary>

A smoke test on the image. The suite ran the code directly, without going through the `Dockerfile`, so nothing checked the artifact that was deployed. Building the image in CI, starting it, and asking for `/health` would have failed there, before reaching any server.

</details>

## Keep exploring

- [GitHub Actions · service containers](https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/about-service-containers) — databases and other dependencies inside the job.
- [Continuous Integration (Martin Fowler)](https://martinfowler.com/articles/continuousIntegration.html) — what CI really is.
