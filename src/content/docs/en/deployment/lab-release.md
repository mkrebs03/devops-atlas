---
title: Practice · promote and roll back
description: Run two versions, switch traffic to the new one and go back, a local blue-green.
type: practice
level: intermediate
module: deployment
tools: [docker, nginx, curl]
prerequisites: [deployment.pipeline]
learningObjectives:
  - Run two versions of a service and swap which one receives traffic.
  - Practise a blue-green style switch and its rollback.
  - Verify each step with an HTTP check.
takeaways:
  - Switching traffic between two versions makes the deployment reversible.
  - A rollback is just pointing back to the previous version.
  - Verifying before and after turns the deployment into evidence.
---

## Goal

Run two versions of a site (blue and green), verify the new one in isolation, switch traffic to it and roll back, a blue-green on your machine.

## Requirements

- Docker.

## Step 1 · the blue version is in production (8080)

```bash
mkdir -p /tmp/atlas-release-lab && cd /tmp/atlas-release-lab
printf '<h1>v1 blue</h1>\n' > blue.html
docker run -d --rm --name atlas-blue -p 8080:80 \
  -v "$PWD/blue.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8080/     # v1 blue
```

## Step 2 · deploy green in isolation (8081)

```bash
printf '<h1>v2 green</h1>\n' > green.html
docker run -d --rm --name atlas-green -p 8081:80 \
  -v "$PWD/green.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8081/     # v2 green (no one in production sees it yet)
```

Green is running and you verified it without exposing it to users.

## Step 3 · switch traffic to green (8080)

```bash
docker stop atlas-blue
docker run -d --rm --name atlas-live -p 8080:80 \
  -v "$PWD/green.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8080/     # now v2 green
```

Production (8080) serves green. The switch was almost instant.

## Step 4 · roll back

Something went wrong: return to blue.

```bash
docker stop atlas-live
docker run -d --rm --name atlas-blue -p 8080:80 \
  -v "$PWD/blue.html:/usr/share/nginx/html/index.html:ro" nginx:alpine
curl -s http://127.0.0.1:8080/     # back to v1 blue
```

Rolling back was just pointing to the previous version again. That is what blue-green buys you.

## Verification and cleanup

The checkable assertion: you could serve the new version and return to the previous one without rebuilding anything.

```bash
docker stop atlas-blue atlas-green 2>/dev/null
rm -rf /tmp/atlas-release-lab
```

## Check your understanding

<details>
<summary>In step 2, green runs on 8081 but users stay on 8080. Why is that useful?</summary>

Because you can verify the new version in isolation —without any user seeing it— before giving it traffic. If something is wrong, you find it on 8081 and it never reaches production. That is the heart of blue-green.

</details>
