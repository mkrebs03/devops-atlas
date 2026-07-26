---
title: From build to release
description: How a single artifact travels through environments to production.
type: concept
level: intermediate
module: deployment
tools: [ci-cd, deployment, docker]
prerequisites: [delivery.github-actions]
learningObjectives:
  - Distinguish continuous integration, continuous delivery, and continuous deployment.
  - Promote a single artifact through environments without rebuilding it.
  - Define what evidence enables the move to production.
takeaways:
  - You build once and promote the same artifact across environments.
  - Environments exist to gain confidence before production.
  - An approval gate turns deployment into an explicit decision.
---

## Three CDs that are not the same

- **Continuous integration**: every change is integrated and validated often.
- **Continuous delivery**: the artifact is always ready to deploy; the move to production is a button.
- **Continuous deployment**: that button is automatic when the checks pass.

The difference between the last two is a **gate**: manual or automatic.

## Build once, promote the same artifact

The classic mistake is rebuilding in each environment. If `staging` and `production` compile separately, you are not testing what you deploy. Build **one** image, identify it by its SHA and promote that same image:

```mermaid
flowchart LR
  B["build (once)"] --> Dev["dev"] --> St["staging"] --> Pr["production"]
```

```bash
# the same immutable image travels across environments
docker tag app:sha-abc123 registry/app:sha-abc123
docker push registry/app:sha-abc123
```

## Environments gain confidence

Each environment answers a question: does it start? does it pass smoke tests? does it behave with realistic data? Production should not be the first place a version runs.

An **approval gate** —for example, a protected `environment` in GitHub Actions— makes explicit who authorizes the final step.

:::tip[Config per environment, single artifact]
What changes between environments is the configuration (variables, secrets, URLs), not the binary. Same artifact, different config: that way what you tested is what runs.
:::

## Check your understanding

<details>
<summary>Your pipeline builds the image in staging and again in production. What risk do you introduce?</summary>

That you are not deploying what you tested: two builds can differ by dependencies, cache or timing. Build a single image, identify it by its SHA and promote that same one to each environment; the config changes, the artifact does not.

</details>

<details>
<summary>What is the difference between continuous delivery and continuous deployment?</summary>

The gate. In continuous delivery the artifact is ready and a person approves the move to production; in continuous deployment that step is automatic when all checks pass.

</details>

## Keep exploring

- [Continuous Delivery (Martin Fowler)](https://martinfowler.com/bliki/ContinuousDelivery.html) — the reference definition.
- [The Twelve-Factor App · config](https://12factor.net/config) — why config belongs per environment.
