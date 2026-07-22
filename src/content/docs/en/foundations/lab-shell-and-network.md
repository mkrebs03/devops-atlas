---
title: Lab · investigate a local application
description: Start a small server, find its port and verify its response.
type: lab
level: beginner
module: foundations
tools: [python, curl, ss, terminal]
estimatedTime: 25 minutes
prerequisites: [linux-cli, networking]
---

## Goal

Start a local server, check which port it occupies and separate a connection problem from an HTTP problem.

## Requirements

- A terminal.
- Python 3 installed.
- `curl` and `ss` available.

## Step 1 · create a response

```bash
mkdir -p /tmp/atlas-lab
printf 'atlas is listening\n' > /tmp/atlas-lab/index.html
cd /tmp/atlas-lab
python3 -m http.server 8080
```

Leave that process running and open a second terminal.

## Step 2 · observe and verify

```bash
ss -lnt | grep ':8080'
curl -i http://127.0.0.1:8080/
```

You should see a listening socket and a `200 OK` response containing `atlas is listening`.

## Step 3 · change one variable

Stop the server with `Ctrl+C` and start it again on port `9090`. Which commands change? What should `curl` return if you still query port `8080`?

:::tip Verification
A good lab ends with a checkable assertion. Here it is: “the process listens on the port I chose and returns the file I published.”
:::

## Cleanup

```bash
rm -rf /tmp/atlas-lab
```
