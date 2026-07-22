# VPS deployment contract

The production host expects:

- Docker Engine with Compose v2.
- The existing Caddy container attached to the external `caddy-net` network.
- For manual deployments, a read-only GHCR token available to the deployment user. The GitHub Actions workflow uses its ephemeral `GITHUB_TOKEN` instead.
- A DNS record for the chosen `devops` subdomain pointing to the VPS.

Create `/opt/devops-atlas/.env` with the image to run:

```env
ATLAS_IMAGE=ghcr.io/OWNER/devops-atlas:sha-COMMIT
```

Then copy `docker-compose.prod.yml` and `nginx.conf` into `/opt/devops-atlas/` and run:

```bash
docker compose --env-file .env -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.prod.yml up -d --remove-orphans
```

The global Caddy configuration should proxy `devops.example.com` to `devops-atlas:80` over `caddy-net`. The container intentionally publishes no host port.
