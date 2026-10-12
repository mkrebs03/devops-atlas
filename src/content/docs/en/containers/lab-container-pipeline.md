---
title: Practice · packaging myapp
description: Turn the sample application into an image, find out why it does not answer at first, and describe it with Compose.
type: practice
module: containers
tools: [docker, docker-compose, curl]
prerequisites: [containers.docker, containers.compose]
---

:::note[Written walkthrough, not run end to end]
I have not run this walkthrough from start to finish. The output shown is illustrative and may differ from yours. If a step does not work, [open an issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## End state

`myapp` packaged as an image, running as a Compose service with a health check, with the `Dockerfile` and `compose.yml` stored in the repository. Along the way you will cause the most common failure when putting an application into a container.

## Requirements

- Docker running, with `docker compose` available.
- The `~/myapp` folder with its repository. If you are coming in here, create it with the `server.js` from [The sample application](/en/sample-app/#the-file).
- About 25 minutes.

## Step 1 · The first Dockerfile

```bash
cd ~/myapp
printf '.git\nnode_modules\n.env\n' > .dockerignore
cat > Dockerfile <<'EOF'
FROM node:22-alpine
WORKDIR /app
COPY server.js ./
USER node
EXPOSE 8080
CMD ["node", "server.js"]
EOF

docker build --tag myapp:local .
docker run --detach --rm --name myapp --publish 127.0.0.1:8080:8080 myapp:local
```

`USER node` keeps the process from running as `root` inside the container. `.dockerignore` leaves out of the build what should not travel in the image.

**Signal:** `docker ps` shows the `myapp` container as `Up`, and `docker logs myapp` says `listening on 127.0.0.1:8080`.

## Step 2 · It starts and does not answer

```bash
curl -i http://127.0.0.1:8080/health
```

**Signal:** it fails. The message depends on how your Docker installation forwards the port: `Connection reset by peer` on Linux, `Empty reply from server` on Docker Desktop, `Couldn't connect to server` on Colima and other virtual machines.

Since the message varies, it is not the evidence. Walk the boundaries as in [Foundations](/en/foundations/networking/) with what is stable: `docker ps` says the container is `Up` and the port is published, so the failure is not that it is not running. And the log says the application listens on `127.0.0.1`. Inside a container that address is **the container**, not your machine: Docker delivers the traffic through the container's network interface, where nobody is listening.

Check it from inside, where `127.0.0.1` really is the application:

```bash
docker exec myapp wget -qO- http://127.0.0.1:8080/health
# {"status":"ok"}
```

The application is healthy. What fails is where it can be reached from.

## Step 3 · Fix the image, then the container

The application reads `HOST` from the environment. Inside a container it has to listen on all of its interfaces:

```bash
cat > Dockerfile <<'EOF'
FROM node:22-alpine
WORKDIR /app
COPY server.js ./
ENV HOST=0.0.0.0
USER node
EXPOSE 8080
CMD ["node", "server.js"]
EOF

docker build --tag myapp:local .
curl -i http://127.0.0.1:8080/health
```

**Signal:** the build marks `WORKDIR` and `COPY` as `CACHED` (`Using cache` if your Docker uses the legacy builder) — they did not change, so they are not redone — and the `curl` **still fails**.

That second result is the lesson. You rebuilt the image, but the running container was born from the previous one and a new image does not touch it. It has to be replaced:

```bash
docker stop myapp
docker run --detach --rm --name myapp --publish 127.0.0.1:8080:8080 myapp:local
curl -i http://127.0.0.1:8080/health
```

**Signal:** `HTTP/1.1 200 OK`. Note that `0.0.0.0` is inside the container; towards the outside, reach is decided by `--publish 127.0.0.1:8080:8080`, which only opens the port on your own machine.

## Step 4 · Same image, different configuration

```bash
docker stop myapp
docker run --detach --rm --name myapp --publish 127.0.0.1:8080:8080 \
  --env APP_VERSION=v1 myapp:local
curl -s http://127.0.0.1:8080/
```

**Signal:** `myapp v1`. You rebuilt nothing: the image is the same and what it receives at start changed. This is the "one artifact, several configurations" idea that later crosses environments.

```bash
docker stop myapp
```

## Step 5 · Describe it with Compose

The flags you have been typing move into a file:

```bash
cat > compose.yml <<'EOF'
services:
  app:
    build: .
    environment:
      APP_VERSION: ${APP_VERSION:-compose}
    ports:
      - "127.0.0.1:8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/health"]
      interval: 10s
      timeout: 3s
      retries: 3
EOF

docker compose up --detach --build
docker compose ps
curl -s http://127.0.0.1:8080/
```

**Signal:** `curl` answers `myapp compose` and, after a few seconds, `docker compose ps` shows the service as `healthy`. That state comes from the `healthcheck`: Docker calls `/health` from inside the container every ten seconds.

## Step 6 · Store it

```bash
git switch -c feat/container
git add Dockerfile .dockerignore compose.yml
git commit -m 'feat: package myapp as a container'
git push -u origin feat/container
```

Open the pull request and merge it, as in the [branches walkthrough](/en/collaboration/lab-git-branching/). From that commit on, anyone who clones the repository builds the same image without you explaining anything.

## When something does not add up

| Symptom | Likely cause | Command |
| --- | --- | --- |
| `curl` fails and `docker ps` does not show the container | It did not start, or the port is not published | `docker ps --all` |
| `curl` fails with the container `Up` | The application listens on `127.0.0.1` inside the container | `docker logs myapp` |
| `port is already allocated` | Another container or process holds 8080 | `docker ps`, `ss -lntp` |
| The service ends up `unhealthy` | The check cannot reach `/health` | `docker compose logs app` |
| The change does not show | You rebuilt the image and did not replace the container | `docker compose up --detach --build` |

## Check your understanding

<details>
<summary>The application listens on 0.0.0.0 inside the container. Is it exposed to the internet?</summary>

Not because of that. `0.0.0.0` refers to the container's interfaces, and the container lives on a private Docker network. What decides whether it is reachable from outside is how you publish the port: `127.0.0.1:8080:8080` opens it only on the host machine; `8080:8080` would open it on all of the host's interfaces.

</details>

<details>
<summary>You rebuilt the image and the container still answers the old thing. Why?</summary>

Because a container is created from the image that existed at that moment and never looks at it again. The `myapp:local` tag now points at a new image, but the running process is still the old one's. You have to stop the container and create another, which is what `docker compose up --build` does.

</details>

## Cleanup

```bash
docker compose down
docker image rm myapp:local
```

Keep the three files in the repository: the [CI walkthrough](/en/integration/lab-ci/) builds this same image on every change.
