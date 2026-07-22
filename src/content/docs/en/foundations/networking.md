---
title: Essential networking
description: Understand DNS, ports and HTTP as a path you can inspect.
type: concept
level: beginner
module: foundations
tools: [dns, http, curl, ss]
estimatedTime: 35 minutes
prerequisites: [linux-cli]
---

## A request is a route

When you visit `https://example.com/api`, several things happen. The client resolves a name, opens a connection, negotiates TLS and sends an HTTP request.

```text
name → DNS → IP → port → TCP/TLS → HTTP → response
```

Each arrow is a diagnostic boundary. Once you know the boundary, you know what evidence to request.

## DNS is not HTTP

DNS translates names into records. HTTP uses those results to talk to a server. Separate the questions:

```bash
dig +short example.com
curl -I https://example.com
```

The first checks a DNS answer. The second displays HTTP headers. If the name does not resolve, application debugging is premature.

## Ports and sockets

A port identifies a process entry point within a machine. Seeing an open port does not prove the application works, but not seeing it rules out part of the path.

```bash
ss -lnt
curl -v http://127.0.0.1:8080/health
```

Look for three facts: listening address, port and responsible process. `127.0.0.1` accepts local traffic only; `0.0.0.0` may accept traffic from several interfaces and deserves more care.

:::note One layer at a time
When a URL fails, check resolution first, then connection and finally the application. A timeout and a `404` are different problems.
:::

## The HTTP contract

An HTTP response communicates more than a body:

| Part | Question |
| --- | --- |
| Status | Was the operation understood and accepted? |
| Headers | Which content type and policies apply? |
| Body | What data does the client receive? |

The DevOps habit is to make this contract visible in logs, tests and documentation.
