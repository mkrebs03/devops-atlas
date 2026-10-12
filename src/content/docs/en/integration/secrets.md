---
title: Secrets and permissions
description: Where the credentials a pipeline needs actually live, and why least privilege matters more than hiding them well.
type: concept
module: integration
tools: [github-actions, ssh, yaml]
prerequisites: [integration.github-actions, server.manual-deploy]
---

## What is a secret and what is not

Not everything that differs between environments is a secret. The test is simple: ask what happens if that value shows up in a public repository.

| Value | Secret? | Why |
| --- | --- | --- |
| `NODE_ENV=production` | No | Grants access to nothing |
| The site's domain | No | Public by definition |
| The database URL | Yes | It carries a user and password inside |
| A deployment token | Yes | It can publish in your name |
| A certificate's public key | No | It is public, it is in the name |
| The runner's private SSH key | Yes | It is the door to the server |

Confusing them costs in both directions: treating non-secrets as secrets complicates operations for nothing, and treating a credential as configuration publishes it.

## Where they live

A secret cannot live in the repository, because whoever clones the code takes it with them. It lives in the platform's store, encrypted, and the workflow receives it as a variable at run time.

```yaml
jobs:
  deploy:
    environment: production        # the environment can require approval
    steps:
      - name: Deploy
        env:
          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
        run: ./scripts/deploy.sh
```

GitHub masks in the run log any value matching a secret. That is a useful safety net and not a guarantee: if your script prints the key base64-encoded, or split across two lines, the filter does not recognise it and it appears in full in the log.

## Permission matters more than the hiding place

A perfectly stored secret granting full access is still a master key: whoever manages to run something in your pipeline inherits all of it.

```yaml
permissions:
  contents: read       # the default for the whole workflow
  packages: write      # only where publishing actually happens
```

Declaring `permissions` at workflow level with the minimum, and widening it only in the job that needs it, limits the damage from any compromised step — including a third-party action updated yesterday.

Two concrete habits:

- **Pin third-party actions by SHA**, not by tag. `uses: someone/action@v3` runs whatever that tag points at today, and the author can move it. `@a1b2c3d…` runs specific bytes.
- **Do not give CI a personal credential.** A token from your account carries all of your access. Use the token the platform itself issues for the workflow, or a dedicated deployment identity with permission over one destination.

:::caution[Pull requests from forks get no secrets, and that is deliberate]
Anyone can open a pull request from a copy of your repository, with the workflow modified. If that run had your secrets, publishing them would be trivial. That is why runs from forks execute without them — and why the deploying job should trigger after merging into `main`, not on the pull request.
:::

## Credentials that expire on their own

The next step is to stop storing long-lived credentials anywhere. With **OIDC**, your workflow presents the cloud provider a token signed by GitHub stating who it is — which repository, which branch, which environment — and the provider returns temporary credentials that expire in minutes.

```yaml
permissions:
  id-token: write      # required to request the OIDC token
  contents: read
```

With this there is no longer a long-lived value to rotate, leak or forget. And the trust is declared on the provider's side, which can require the request to come from a specific repository and branch.

## When one escapes

When it happens, the order of the response matters:

1. **Rotate first.** Invalidate the value and issue a new one. This stops the damage; nothing else does.
2. **Clean up afterwards.** Removing the commit does not do it alone: the value stays in every clone's and every fork's history.
3. **Review the affected service's access log**, in case it was already used.

```bash
git log -p -S 'AKIA' -- .          # does anything of this shape appear in history?
```

Rewriting history before rotating leaves a valid secret in the hands of anyone who had already cloned, and creates the impression of having resolved it.

## Keep exploring

- [GitHub · encrypted secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) — where they are stored and how they reach the workflow.
- [GitHub · OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) — temporary credentials with no stored secrets.
- [OWASP · secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) — the full lifecycle, rotation included.
