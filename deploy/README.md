# VPS deployment contract

The current production hostname is `devops.lazycat.app`.

The production host expects:

- Docker Engine with Compose v2.
- The existing Caddy container attached to the external `caddy-net` network.
- For manual deployments, a read-only GHCR token available to the deployment user. The GitHub Actions workflow uses its ephemeral `GITHUB_TOKEN` instead.
- A DNS record for `devops.lazycat.app` pointing to the VPS.

Create `/opt/devops-atlas/.env` with the image to run:

```env
ATLAS_IMAGE=ghcr.io/OWNER/devops-atlas:sha-COMMIT
```

Then copy `docker-compose.prod.yml` and `nginx.conf` into `/opt/devops-atlas/` and run:

```bash
docker compose --env-file .env -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.prod.yml up -d --remove-orphans
```

The global Caddy configuration should proxy `devops.lazycat.app` to `devops-atlas:80` over `caddy-net`. The container intentionally publishes no host port.

## GitHub Actions contract

The `Deploy DevOps Atlas` workflow needs exactly this repository configuration:

Secrets:

- `VPS_SSH_PRIVATE_KEY` — private key for the deployment user on the VPS.
- `VPS_KNOWN_HOSTS` — `known_hosts` entry for the VPS (from `ssh-keyscan HOST`).
- `VPS_HOST` — hostname or IP the workflow connects to.
- `VPS_USER` — user the workflow connects as.

Repository variables:

- `PUBLIC_SITE_URL` — the canonical production URL (`https://devops.lazycat.app`). The workflow refuses to deploy while it is unset or still a placeholder.

No `GHCR_USER` secret exists: GHCR logins (push in CI, pull on the VPS) use the workflow's ephemeral `GITHUB_TOKEN` with `github.actor` as the username.

## Rollback

Every image is tagged `sha-COMMIT`, so rolling back is pointing `.env` at the previous commit. The workflow does this automatically when the post-deploy health check fails; to do it by hand on the VPS:

```bash
# Edit ATLAS_IMAGE in /opt/devops-atlas/.env to the previous sha-COMMIT, then:
docker compose --env-file /opt/devops-atlas/.env -f /opt/devops-atlas/docker-compose.prod.yml up -d --remove-orphans
```

The previous image is still in the local Docker cache, so no registry login is needed.
