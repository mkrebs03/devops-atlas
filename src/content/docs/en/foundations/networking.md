---
title: Essential networking
description: Understand DNS, ports, TLS and HTTP as a path you can inspect.
type: concept
level: beginner
module: foundations
tools: [dns, http, tls, curl, ss]
prerequisites: [foundations.terminal]
learningObjectives:
  - Follow a request from DNS resolution to the HTTP response, including TLS.
  - Tell a private address from a public one and know where traffic leaves through.
  - Distinguish failures in resolution, connection, port, and application behaviour.
  - Read a status code and headers as part of the HTTP contract.
takeaways:
  - Each network boundary provides a concrete signal you can check.
  - A private address only means something inside its own network; the gateway is the way out.
  - DNS, TCP, TLS, and HTTP answer different questions along the same route.
  - A status code says as much as the response body.
---

## A request is a route

When you visit `https://example.com/api`, several things happen in order. The client resolves a name, opens a connection, negotiates TLS and only then sends an HTTP request. Each leg is a **diagnostic boundary**: once you know which one you are on, you know what evidence to request.

```mermaid
flowchart LR
  N["Name"] --> D["DNS · IP"]
  D --> T["TCP · port"]
  T --> L["TLS · certificate"]
  L --> H["HTTP · request"]
  H --> R["Response"]
```

A failure lives on one of those boundaries, not all at once. The rule is to walk them from the outside in.

## DNS translates, it does not transport

An **IP** is a machine's address on the network: the number packets have to be sent to in order to arrive. Names exist because those addresses change, get spread across several machines, and nobody memorises them.

DNS turns a name into records: an IP in an `A` record (or `AAAA` for IPv6), an alias in a `CNAME`. It does not carry your request; it only tells you where to go.

```bash
dig +short example.com        # which IP answers this name?
cat /etc/hosts                # is there a local override?
```

If the name does not resolve, debugging the application is premature: you do not yet know which machine you are talking to.

## Not every address is reachable from outside

A resolved IP is not always a reachable IP. Many of the addresses you will see day to day are **private**: valid inside one particular network and meaningless outside it.

| Range | Where it shows up |
| --- | --- |
| `10.0.0.0/8` | company networks and private clouds |
| `172.16.0.0/12` | default Docker networks |
| `192.168.0.0/16` | home and office routers |
| `127.0.0.0/8` | *loopback*: the machine itself (`localhost`) — not private, it never leaves onto the network |

The `/24` suffix is the **subnet mask**: it says how many leading bits of the address identify the network and how many are left for the machines inside it. `192.168.1.40/24` means "anything starting with `192.168.1.` is on my network". That boundary decides the next hop: if the destination falls inside, the machine talks to it directly; if it falls outside, it hands the packet to the **gateway** —the way out towards every other network— which is what the default route points at.

```bash
ip addr     # which addresses and masks does this machine have?
ip route    # which is the default gateway?
```

Two common confusions come from this. A service answering on `192.168.1.40:3000` from your laptop is not reachable from the internet: that address does not exist outside your network, and what the world sees is the router's public IP, which translates between the two. And a container has its own private address inside the Docker network, so "it listens on port 3000" only means something once you say on which network it listens.

## Connection: ports, sockets and TLS

A machine has one IP and many programs running at once. The **port** is the number that decides which of them a connection enters: 80 for HTTP, 443 for HTTPS, and whichever you pick for your application. The IP + port pair is what is called a **socket**, and it is the real address a client connects to.

Seeing an open port does not prove the application works, but not seeing it rules out part of the path.

```bash
ss -lnt                                  # what is listening locally?
curl -v https://example.com 2>&1 | head  # narrates resolution, TCP and TLS
```

`curl -v` tells the story step by step: it resolves the IP, opens TCP to port 443, receives and validates the TLS **certificate** presented by the server, and only then sends the HTTP request. `127.0.0.1` accepts local traffic only; `0.0.0.0` may accept traffic from several interfaces and deserves more care. TLS exists for two reasons: to encrypt the connection and to prove the server is who it claims to be.

Between the client and that port there is usually a **firewall**: a filter that decides which connections are accepted before they reach the process. It explains a symptom that confuses many people: if nothing is listening, the machine refuses and you see `Connection refused` straight away; if a firewall drops the packet silently, you see nothing and the connection hangs until it times out.

:::note[One layer at a time]
When a URL fails, check resolution (DNS) first, then connection (TCP/TLS), and finally the application (HTTP). A timeout and a `404` are different problems.
:::

## The HTTP contract

An HTTP response communicates far more than a body. The **status code** summarises what happened:

| Family | Meaning | Example |
| --- | --- | --- |
| `2xx` | Success | `200 OK` |
| `3xx` | Redirection | `301 Moved Permanently` |
| `4xx` | Client error | `404 Not Found` |
| `5xx` | Server error | `503 Service Unavailable` |

A `4xx` means the server could not handle the request as it arrived —for example, because the resource does not exist (`404`) or authentication is missing (`401`). A `5xx` means the server or another component in the path could not complete a valid request. Confusing them sends the investigation to the wrong side.

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://example.com
```

Headers complete the contract: content type, caching and policies. The DevOps habit is to make this contract visible in logs, tests and documentation.

## Check your understanding

<details>
<summary>curl returns "Could not resolve host". Which boundary are you on?</summary>

DNS: the name was not translated into an IP, so there was no connection and no HTTP. Check `dig +short`, your resolver and `/etc/hosts` before looking at the application.

</details>

<details>
<summary>You get 503 instead of 200. Is it a client or a server problem?</summary>

Server: the `5xx` family means it could not complete a valid request —often overload or a downstream dependency being down. A `4xx` would be the client. Look at the service logs and status, not your request.

</details>

## Keep exploring

- [MDN · HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) — a clear reference for methods, statuses and headers.
- [High Performance Browser Networking](https://hpbn.co/) — how a request really travels (free online).
- `man curl` and `man dig` — the flags you will use daily.
