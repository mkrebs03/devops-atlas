---
title: The sample application
description: The minimal service every Atlas walkthrough works on, from your machine to an automated deployment.
---

Every walkthrough in the Atlas works on the same application, `myapp`: a single-file HTTP server with no dependencies. It is small on purpose. What changes from one walkthrough to the next is not the application, but where it runs and who puts it there.

## The file

You need Node 18 or later. Create a `myapp` folder in your home directory and save this as `server.js`:

```js
const http = require('node:http');

const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';
const version = process.env.APP_VERSION || 'dev';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end('{"status":"ok"}\n');
  }
  if (req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end(`myapp ${version}\n`);
  }
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('not found\n');
});

if (require.main === module) {
  server.listen(port, host, () => console.log(`listening on ${host}:${port}`));
}

module.exports = server;
```

```bash
node server.js
# listening on 127.0.0.1:8080
```

## What it exposes

| Route | Responds | What it is used for |
| --- | --- | --- |
| `/` | `myapp <version>` | Seeing which version is serving |
| `/health` | `{"status":"ok"}` | Health checks and smoke tests |
| `/version` | `404`, for now | You add it in the [CI walkthrough](/en/integration/lab-ci/), starting from its test |
| anything else | `404 not found` | Telling an application failure from a connection failure |

## What configuration it reads

The application carries no fixed values: everything that changes between environments comes in through variables.

| Variable | Default | Why it matters |
| --- | --- | --- |
| `PORT` | `8080` | The port it listens on |
| `HOST` | `127.0.0.1` | The interface it listens on. On a server it stays local, behind the proxy; inside a container it has to be `0.0.0.0` |
| `APP_VERSION` | `dev` | The version it announces. The pipeline sets it when it builds the image |

The last two statements in the file make the server start listening only when you run it directly. If another file imports it — a test — it gets the server unstarted and decides which port to bring it up on.

## Where it appears

| Walkthrough | What happens to `myapp` |
| --- | --- |
| [Investigate a local application](/en/foundations/lab-shell-and-network/) | It runs on your machine and you inspect it with `ss` and `curl` |
| [Safe branches](/en/collaboration/lab-git-branching/) | It goes into a repository and reaches GitHub |
| [From empty VPS to HTTPS](/en/server/lab-vps-deploy/) | It runs on a server as a service, behind nginx |
| [Packaging myapp](/en/containers/lab-container-pipeline/) | It becomes an image and a Compose service |
| [A test and a workflow](/en/integration/lab-ci/) | It gains a test and a workflow that runs it on every change |
| [Promote and roll back](/en/deployment/lab-release/) | Two versions run side by side and a proxy decides which one gets traffic |

Each walkthrough states what it needs from the earlier ones. If you come in halfway, this file is all it takes to start.
