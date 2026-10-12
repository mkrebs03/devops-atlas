---
title: The testing pyramid
description: Unit, integration and end-to-end tests, and how to pick the right level.
type: concept
module: integration
tools: [node]
prerequisites: []
---

## Three levels, three questions

```mermaid
flowchart TB
  E["End to end · few"] --> I["Integration · some"] --> U["Unit · many"]
```

- **Unit**: tests a function or module in isolation. Fast, precise, cheap. Answers: does this piece do what I say?
- **Integration**: tests that several pieces cooperate (for example, code plus a database). Answers: do they fit together?
- **End to end (E2E)**: tests the system the way a person uses it. Slow and valuable. Answers: does the whole route work?

The pyramid shape has a reason: it pays to have **many** unit tests (fast) and **few** E2E tests (slow). Inverting the pyramid —mostly E2E— produces slow, flaky suites.

## What makes a test good

- **Deterministic**: same input, same result, without depending on the time or the network.
- **Isolated**: it does not depend on order or on another test.
- **Readable**: its name says which behaviour it protects.

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

// a unit test: the name describes the expected behaviour
test('sum ignores null values', () => {
  assert.equal(sum([1, null, 2]), 3);
});
```

## Flaky tests

A **flaky** test fails for reasons unrelated to behaviour: a timeout, a changed selector, a random value. Each false failure erodes trust until the team ignores the suite, and then it protects nothing. Prefer a few reliable tests over many noisy ones.

:::caution[Do not test the implementation, test the behaviour]
A test tied to internal details breaks on every refactor, even when behaviour does not change. Assert what the system does, not how it does it.
:::

## Keep exploring

- [The Practical Test Pyramid (Martin Fowler)](https://martinfowler.com/articles/practical-test-pyramid.html) — the reference article.
- [Google Testing Blog](https://testing.googleblog.com/) — testing practices at scale.
