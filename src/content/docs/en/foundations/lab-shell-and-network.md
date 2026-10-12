---
title: Practice · investigate a local application
description: Start the sample application, find its port, and tell a connection failure from an application failure.
type: practice
module: foundations
tools: [node, curl, ss]
prerequisites: [foundations.terminal, foundations.networking]
---

:::note[Written walkthrough, not run end to end]
I have not run this walkthrough from start to finish. The output shown is illustrative and may differ from yours. If a step does not work, [open an issue](https://github.com/mkrebs03/devops-atlas/issues).
:::

## End state

The [sample application](/en/sample-app/) running on your machine, and three separate pieces of evidence: that it listens, that it responds, and what each kind of failure looks like. The folder you create here is reused by the other walkthroughs.

## Requirements

- Two terminals.
- Node 18 or later, and `curl`.
- `ss`, which ships with any Linux. macOS does not have it: use `lsof -nP -iTCP -sTCP:LISTEN` wherever this page says `ss -lnt`.
- About 15 minutes.

## Step 1 · Start the application

Create the folder `~/myapp` and save the `server.js` from [The sample application](/en/sample-app/#the-file) inside it. Then:

```bash
cd ~/myapp
node server.js
```

**Signal:** the terminal prints `listening on 127.0.0.1:8080` and stays busy. Leave it there and carry on in the second one.

## Step 2 · Two pieces of evidence, not one

```bash
ss -lntp | grep ':8080'
curl -i http://127.0.0.1:8080/health
```

**Signal:** a socket in `LISTEN` state on `127.0.0.1:8080`, and a response that starts like this:

```text
HTTP/1.1 200 OK
content-type: application/json
...
{"status":"ok"}
```

They are different pieces of evidence. The socket says "something is listening"; the `200` says "the application answered what I expected". The `-p` option adds the process that owns the socket; seeing another user's processes takes `sudo`.

## Step 3 · An application failure

Request a route that does not exist, without stopping the server:

```bash
curl -i http://127.0.0.1:8080/does-not-exist
```

**Signal:** `HTTP/1.1 404 Not Found`. There was a connection and there was an HTTP response: the server is available and tells you that resource does not exist. This is the **application** boundary.

## Step 4 · A connection failure

Now query a port nobody is listening on:

```bash
curl -i http://127.0.0.1:9090/health
```

**Signal:** `curl` exits with error `(7)` and a message containing `Connection refused` or `Couldn't connect to server`, depending on the version. There is no `HTTP/...` line because HTTP never happened: this is the **connection** boundary.

## Step 5 · Move the port

Stop the server with `Ctrl+C` and start it on another port, without touching the file:

```bash
PORT=9090 node server.js
```

Repeat both `curl` calls to `/health`, the one to `8080` and the one to `9090`.

**Signal:** they swapped. Now `9090` answers `200` and `8080` refuses the connection. The code is the same; an environment variable changed, which is how this application receives its configuration in every walkthrough that follows.

## When something does not add up

| Symptom | Likely boundary | First command |
| --- | --- | --- |
| `Connection refused` | Nothing listens on that port | `ss -lnt` |
| It hangs (timeout) | Firewall or listen address | `curl -v` |
| `404 Not Found` | Route or resource does not exist | `curl -i` |
| `EADDRINUSE` on start | Another process already holds the port | `ss -lntp` |

## Cleanup

Stop the server with `Ctrl+C`. **Do not delete `~/myapp`**: the [safe branches](/en/collaboration/lab-git-branching/) walkthrough starts in that folder.
