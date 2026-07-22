---
title: Lab · your first test
description: Write a failing test, make it pass, and run it the way CI would.
type: lab
level: beginner
module: testing
tools: [node, testing]
estimatedTime: 25 minutes
prerequisites: [testing.pyramid]
learningObjectives:
  - Write a unit test that fails for the right reason.
  - Make it pass with the smallest change to the code.
  - Run the suite the way CI would.
takeaways:
  - A test should fail before it passes, to prove it tests something.
  - The red-green cycle turns an intention into evidence.
  - Running the suite locally anticipates what CI will do.
---

## Goal

Write a test that first fails (red), then the code that makes it pass (green), using the test runner built into Node. No dependencies to install.

## Requirements

- Node 18 or newer (ships with `node --test` built in).

## Step 1 · a failing test

```bash
mkdir -p /tmp/atlas-test-lab && cd /tmp/atlas-test-lab
cat > sum.mjs <<'EOF'
export function sum(numbers) {
  // not implemented yet
}
EOF
cat > sum.test.mjs <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sum } from './sum.mjs';

test('sum ignores null values', () => {
  assert.equal(sum([1, null, 2]), 3);
});
EOF
node --test
```

It must fail: the assertion is not met because `sum` does nothing yet. A test that fails for the right reason proves it actually tests something.

## Step 2 · make it pass (green)

```bash
cat > sum.mjs <<'EOF'
export function sum(numbers) {
  return numbers.filter((n) => typeof n === 'number').reduce((a, b) => a + b, 0);
}
EOF
node --test
```

Now it passes. You walked the **red → green** cycle: the test defined the behaviour before the code.

## Step 3 · run the suite like CI

```bash
node --test   # the same command you would put in a CI job
```

CI would run exactly this in a clean environment. If it passes locally with pinned dependencies, it will pass in CI.

## When something is off

| Symptom | Likely cause | What to check |
| --- | --- | --- |
| The test passes without any implementation | It does not assert what you think | the `assert` |
| `Cannot find module` | Import path or extension | the `from './sum.mjs'` |
| Passes locally, fails in CI | Dependency or environment | lockfile and Node version |

## Check your understanding

<details>
<summary>You wrote the test and it passed on the first try, without touching the code. What should you suspect?</summary>

That the test is not asserting what you think: if it passes with no implementation, it does not protect that behaviour. Adjust it until it fails for the right reason, and only then implement.

</details>

## Cleanup

```bash
rm -rf /tmp/atlas-test-lab
```
