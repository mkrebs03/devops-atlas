---
title: Testing
description: Turn confidence into evidence with automated tests and fast feedback.
type: concept
level: beginner
module: testing
tools: [testing, ci]
estimatedTime: 10 minutes
prerequisites: [collaboration.github-flow]
learningObjectives:
  - Explain why automated tests turn confidence into evidence.
  - Locate where each kind of test lives along a change's route.
takeaways:
  - A test is an executable assertion about the system's behaviour.
  - A test's value is in fast feedback, not in the number of tests.
---

## Testing is asserting with evidence

An automated test is an executable assertion: given some input, the system responds in a certain way. When it fails, you do not argue opinions; you read concrete, reproducible evidence.

In Foundations you learned to observe; in Collaboration, to review; in Delivery, to package. Testing closes the loop: it turns "I think it works" into "I can prove it works".

## The route

```mermaid
flowchart LR
  U["unit"] --> I["integration"] --> E["end to end"] --> CI["in CI"]
```

| Moment | Question | Page |
| --- | --- | --- |
| Pyramid | What to test and at which level? | [The testing pyramid](./pyramid/) |
| Automation | How do tests run on every change? | [Tests in CI](./in-ci/) |
| Practice | Can I write and run a test? | [Lab · your first test](./lab-first-test/) |

:::note A test that never fails protects nothing
If a test always passes, even when you break the code, it is not testing what you think. A good test fails when the behaviour changes.
:::

## Expected outcome

You will be able to distinguish test levels, decide what to automate in CI, and write a first test that fails for the right reason.
