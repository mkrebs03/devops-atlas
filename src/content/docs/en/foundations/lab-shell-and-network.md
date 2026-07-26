---
title: Practice · investigate a local application
description: Start a small server, find its port and verify its response.
type: practice
level: beginner
module: foundations
tools: [python, curl, ss]
prerequisites: [foundations.terminal, foundations.networking]
learningObjectives:
  - Start a local server and identify the port where it listens.
  - Verify an application's connection and HTTP response separately.
  - Tell the difference between a refused connection and an HTTP error response.
takeaways:
  - A listening process and a correct HTTP response are distinct pieces of evidence.
  - A connection failure and a 404 point to different boundaries of the route.
  - Combining small tools makes a network investigation reproducible.
---

## Goal

Start a local server, check which port it listens on and separate a connection problem from an HTTP problem —the same reasoning you will use in production, but on your machine.

## Requirements

- A terminal (ideally open two).
- Python 3, `curl` and `ss` available.
- About 15 minutes.

## Step 1 · publish a response

```bash
mkdir -p /tmp/atlas-lab
printf 'atlas is listening\n' > /tmp/atlas-lab/index.html
cd /tmp/atlas-lab
python3 -m http.server 8080
```

Leave that process running and open a second terminal for the rest.

## Step 2 · observe the socket and verify the response

```bash
ss -lnt | grep ':8080'
curl -i http://127.0.0.1:8080/
```

You should see a socket in the `LISTEN` state and a response that starts like this:

```text
HTTP/1.0 200 OK
...
atlas is listening
```

These are **two distinct pieces of evidence**: the socket says "something is listening"; the `200` says "the application returned what I expected".

## Step 3 · cause a failure on purpose

Query a port where nothing is listening:

```bash
curl -i http://127.0.0.1:9090/
# curl: (7) Failed to connect to 127.0.0.1 port 9090: Connection refused
```

`Connection refused` is not a `404`: there was no HTTP at all. It is the **connection** boundary, not the application one. Now stop the server with `Ctrl+C`, restart it on port `9090` and repeat the previous `curl`. What changed and why?

## When something is off

| Symptom | Likely boundary | First command |
| --- | --- | --- |
| `Connection refused` | Nothing listens on that port | `ss -lnt` |
| Hangs (timeout) | Firewall or listen address | `curl -v` |
| `200 OK` but odd content | Application / served file | `curl -i` |

## Verification

The lab ends with a checkable assertion: **"the process listens on the port I chose and returns the file I published"**. If you can demonstrate that with `ss` and `curl`, you met the goal.

## Check your understanding

<details>
<summary>curl returns "Connection refused". What should you NOT debug yet?</summary>

The application. "Connection refused" means nothing was listening on that port, so there was never an HTTP request to analyse. Confirm first with `ss -lnt` that the process listens where you think it does.

</details>

## Cleanup

```bash
rm -rf /tmp/atlas-lab
```
