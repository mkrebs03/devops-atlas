---
title: Practice · local pipeline
description: Build a static image, run it, observe the layer cache and verify its HTTP contract.
type: practice
level: beginner
module: containers
tools: [docker, nginx, curl]
prerequisites: [containers.docker, foundations.networking]
learningObjectives:
  - Build a reproducible image that contains a static site.
  - Run the container and verify its contract through an HTTP request.
  - Observe how the layer cache speeds up a rebuild.
takeaways:
  - Building, running, and verifying are separate delivery stages.
  - An HTTP check confirms that the artifact responds as expected.
  - Dockerfile order changes which layers are reused on a rebuild.
---

## Goal

Turn an HTML file into a Docker image, verify that the container serves exactly the artifact you expect, and observe the layer cache on a rebuild.

## Requirements

- Docker running and `curl` available.
- About 15 minutes.

## Step 1 · create a tiny site

```bash
mkdir -p /tmp/atlas-container-lab
cd /tmp/atlas-container-lab
printf '<h1>Atlas pipeline green</h1>\n' > index.html
cat > Dockerfile <<'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EOF
```

## Step 2 · build and run

```bash
docker build --tag atlas-lab:local .
docker run --detach --rm --name atlas-lab --publish 8080:80 atlas-lab:local
curl --fail http://127.0.0.1:8080/
```

The response should contain `Atlas pipeline green`. If the container does not start, inspect the built image first and then the published port.

## Step 3 · observe the layer cache

Change the content and rebuild:

```bash
printf '<h1>Atlas pipeline green v2</h1>\n' > index.html
docker build --tag atlas-lab:local .
```

In the output you will see `CACHED` on the `FROM nginx:alpine` layer (unchanged) and a rebuild of only the `COPY index.html` layer. Docker reuses what it can: that is why instruction order matters.

## Step 4 · inspect the evidence

```bash
docker ps --filter name=atlas-lab
docker logs atlas-lab
docker image inspect atlas-lab:local --format '{{.Id}}'
```

## When something is off

| Symptom | Likely cause | Command |
| --- | --- | --- |
| `Connection refused` | Container did not start or the port is not published | `docker ps` |
| `404 Not Found` | The file did not land where nginx serves | `docker exec atlas-lab ls /usr/share/nginx/html` |
| The build fails | An error in the Dockerfile or context | read the line `docker build` reports |

## Verification

The checkable assertion is: the container serves the artifact I built, and a rebuild reuses the layers that did not change.

## Check your understanding

<details>
<summary>You rebuild after changing only index.html and the FROM layer shows as CACHED. Is that correct?</summary>

Yes: the `FROM nginx:alpine` instruction did not change, so Docker reuses that layer and only redoes the `COPY` of the modified file. That reuse is exactly what makes rebuilds fast.

</details>

:::note[An image is an artifact]
A real pipeline should not depend on files that happen to exist on the server. Build the artifact once, identify its version and promote that same version.
:::

## Cleanup

```bash
docker stop atlas-lab
rm -rf /tmp/atlas-container-lab
```
