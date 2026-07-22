---
title: Lab · local pipeline
description: Build a static image, run it and verify its HTTP contract.
type: lab
level: beginner
module: delivery
tools: [docker, nginx, curl]
estimatedTime: 35 minutes
prerequisites: [delivery.docker, foundations.networking]
learningObjectives:
  - Build a reproducible image that contains a static site.
  - Run the container and verify its contract through an HTTP request.
takeaways:
  - Building, running, and verifying are separate delivery stages.
  - An HTTP check confirms that the artifact responds as expected.
---

## Goal

Turn an HTML file into a Docker image and verify that the process inside the container serves exactly the artifact you expect.

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

The response should contain `Atlas pipeline green`. If the container does not start, inspect the image first and then the published port.

## Step 3 · inspect the evidence

```bash
docker ps --filter name=atlas-lab
docker logs atlas-lab
docker image inspect atlas-lab:local --format '{{.Id}}'
```

## Verification and cleanup

```bash
docker stop atlas-lab
rm -rf /tmp/atlas-container-lab
```

:::note An image is an artifact
The real pipeline should not depend on files that happen to exist on the VPS. Build the artifact once, identify its version and promote that same version.
:::
