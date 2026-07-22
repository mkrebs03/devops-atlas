---
title: GitHub Actions
description: Turn the validation path into a visible and repeatable workflow.
type: tool
level: beginner
module: delivery
tools: [github-actions, ci-cd, yaml]
estimatedTime: 35 minutes
prerequisites: [github-flow]
---

## A workflow is an executable promise

GitHub Actions describes what happens in response to repository events. A documentation pipeline can be small and still teach good boundaries:

```yaml
name: Validate Atlas

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.29.3
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
```

The workflow should not hide the work: every step should say what it guarantees and which evidence it leaves.

## Validation is not deployment

Pull requests run checks without touching production. Only after merging into `main` should the publishable image be built and deployment requested.

:::tip Treat the pipeline as a product
A CI error is a user experience. Short messages, reproducible commands and visible artifacts reduce the time between failure and learning.
:::

## Secrets and permissions

Secrets belong in GitHub, not in YAML or the repository. Give each job the minimum it needs: read code to validate and write packages only in the job that publishes an image.
