---
title: Tests in CI
description: Run tests and lint on every change, and read coverage without fooling yourself.
type: tool
level: intermediate
module: testing
tools: [ci-cd, github-actions, testing]
estimatedTime: 30 minutes
prerequisites: [delivery.github-actions]
learningObjectives:
  - Run tests and lint automatically on every change with CI.
  - Interpret coverage without turning it into an empty goal.
  - Order the steps to get feedback as early as possible.
takeaways:
  - CI runs the suite in a clean, repeatable environment, not just on your machine.
  - Coverage measures executed lines, not verified behaviour.
  - The most useful feedback is the one that arrives first and points to the cause.
---

## The suite runs on every change

In Delivery you saw that a workflow describes what happens on events. Tests fit right there: every push and every pull request runs them in a clean environment, not just on your machine.

```mermaid
flowchart LR
  PR["pull request"] --> L["lint"] --> U["unit tests"] --> I["integration"] --> R["result"]
```

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
```

Order from cheap to expensive: lint first (seconds), then unit, then integration. That way the most common failure shows up earliest.

## Coverage: a compass, not a destination

**Coverage** measures what percentage of the code your tests execute. It is useful for finding untested areas, but it misleads as a goal: you can have 100% coverage and zero useful assertions. Executing a line is not the same as verifying its behaviour.

Use it to ask what went untested and why, not to chase a number.

:::tip Fail fast, fail clearly
A CI job that takes 30 minutes discourages the whole team. Parallelize, cache dependencies, and put the fast checks first.
:::

## When CI fails and your machine does not

It is almost always an environment difference: an unpinned dependency, a missing variable, a test that relied on local data. CI is valuable precisely for that: it runs in a clean environment that reveals those assumptions.

## Check your understanding

<details>
<summary>You have 95% coverage but bugs still reach production. How is that possible?</summary>

Coverage only says which lines ran, not whether you asserted them correctly. You can execute code without checking its result. Make sure each test has meaningful assertions about behaviour, not just that it "passes through".

</details>

<details>
<summary>A test passes on your machine and fails in CI. What is the first suspicion?</summary>

An environment difference: unpinned dependencies (use a lockfile and `npm ci`), missing environment variables, or data that existed only on your machine. CI runs clean and therefore exposes those assumptions.

</details>

## Keep exploring

- [GitHub Actions · testing](https://docs.github.com/en/actions/automating-builds-and-tests) — patterns for running tests.
- [Continuous Integration (Martin Fowler)](https://martinfowler.com/articles/continuousIntegration.html) — what CI really is.
