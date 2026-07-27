---
title: Continuous deployment
description: Take an artifact to production with safe strategies and the ability to roll back.
type: concept
level: intermediate
module: deployment
tools: [nginx, docker]
prerequisites: [integration.github-actions]
learningObjectives:
  - Relate continuous integration and continuous delivery along one route.
  - Recognise what makes a deployment safe or risky.
takeaways:
  - Deploying often and in small portions reduces the risk of each change.
  - Being able to roll back fast matters more than never failing.
---

**Where you are:** you have a tested artifact. What is left is the last stretch, and the most visible one: putting it in front of real users without cutting the service, knowing how it behaves, and being able to go back.

## From integrating to delivering

You already build an artifact and test it in CI. Deploying is the last leg: getting that artifact into a person's hands, under controlled conditions and with an emergency exit.

**Continuous integration (CI)** keeps the code always integrable. **Continuous delivery (CD)** keeps the artifact always deployable, and sometimes deploys it on its own.

```mermaid
flowchart LR
  A["tested artifact"] --> S["staging"] --> Ap["approval"] --> P["production"] --> V["verify + able to roll back"]
```

## The route

| Moment | Question | Page |
| --- | --- | --- |
| Pipeline | How does an artifact go from build to release? | [From build to release](/en/deployment/pipeline/) |
| Traffic | Who decides which instance each request reaches? | [Load balancing](/en/deployment/load-balancing/) |
| Strategy | How do I change the version without taking the service down? | [Deployment strategies](/en/deployment/strategies/) |
| Practice | Can I promote and roll back a version? | [Practice · promote and roll back](/en/deployment/lab-release/) |

:::note[Deploying is not an event, it is a capability]
A mature team does not pray before a yearly deploy. It deploys often, in small portions, and can roll back in minutes.
:::

## What you can do with this

These pages let you describe a delivery pipeline, choose a deployment strategy by risk, know what to watch in the minutes that follow, and practise a promotion with rollback.

## Where this breaks

| Symptom | What causes it | Where it continues |
| --- | --- | --- |
| The deployment finishes and nobody knows whether the service is healthy | Evidence stops at the pipeline instead of continuing into production | [Observability](/en/scaling/observability/) |
| Replacing the version cuts off requests that were in flight | Nothing takes the traffic while the old process shuts down | [Load balancing](/en/deployment/load-balancing/) |
| Rolling back takes as long as deploying, so nobody rolls back | The previous version was never kept as an artifact ready to return to | [Practice · promote and roll back](/en/deployment/lab-release/) |
