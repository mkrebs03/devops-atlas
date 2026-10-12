---
title: Load balancing
description: Several instances of the same service, and the decision of which one each request goes to.
type: concept
module: deployment
tools: [nginx, traefik, http]
prerequisites: [server.proxy-tls]
---

:::note
I have studied load balancing across several instances but I have not run it on a real system. [About this site](/en/about/) lists what I run and what I do not.
:::

## When one instance stops being enough

With a single process behind the proxy, two things limit you at once: the machine saturates, and that process going down is the service going down. The answer to both is the same: run several identical copies.

Now the proxy has one more decision to make. Not only *which service* the request goes to, but **which of the copies**. That is **load balancing**.

```nginx
upstream app {
  server 127.0.0.1:8081 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:8082 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:8083 max_fails=3 fail_timeout=30s;
}
```

The default distribution is round robin: one each, in order. You can also distribute by fewest active connections, or pin a client to one particular instance.

## The health check is what makes it useful

Without one, the balancer distributes blindly and keeps sending traffic to a dead instance: with three copies and one down, one request in three fails. There are two ways to avoid that.

- **Passive check.** The one in the block above. nginx open source asks nothing: it watches real requests and, when an instance accumulates `max_fails` failures inside the `fail_timeout` window, pulls it out of rotation for that window before trying again. Cheap, but it finds out by failing real users' requests.
- **Active check.** The balancer probes an endpoint like `/health` every few seconds and pulls out whichever instance does not answer, without waiting for anything real to fail. This is how NGINX Plus, HAProxy, Traefik and cloud balancers work.

```bash
curl -s http://127.0.0.1:8081/health
# {"status":"ok","db":"ok"}
```

Whether that endpoint is honest is the application's responsibility: if it returns `200` without checking its dependencies, the balancer will keep an instance in rotation that cannot serve anyone.

## Why there are no deployment strategies without this

Here is the underlying reason to read this page before the next one. Deploying without cutting the service always comes down to the same thing: **changing where the traffic points**. All that changes between strategies is what you touch in the balancer.

| Strategy | What changes in the balancer |
| --- | --- |
| Rolling | Pull one instance out of rotation, update it, put it back; repeat |
| Blue-green | Switch the `upstream` block's target from the old version to the new one |
| Canary | Distribute by weight: 95% to the current version, 5% to the new one |

And the rollback is the same operation in reverse, which is what makes it fast: you rebuild nothing, you point back.

:::caution[Open connections do not disappear on their own]
When you pull an instance out, the requests it was already serving are still alive. A deployment without downtime needs *draining*: stop sending it new traffic, wait for it to finish what it has in hand, and only then shut it down.
:::

## State gets in the way

If your application keeps something in its own memory — the session of whoever signed in, a cart, an uploaded file — balancing breaks it: that user's next request lands on another instance that knows nothing about any of it.

The way out is not pinning each user to one instance, but moving the state outside: sessions in a database or in Redis, files in shared storage. An application whose instances are interchangeable is the one you can scale and deploy without ceremony.

## Check your understanding

<details>
<summary>You have three instances and one loses its database. Why does a third of requests keep failing?</summary>

Because the balancer still considers it healthy. Either no health check is configured, or the endpoint returns `200` without checking its dependencies. The process still being alive does not mean it can serve: the check has to verify what the application needs in order to answer.

</details>

<details>
<summary>Why is a blue-green switch nearly instant if the new version takes minutes to start?</summary>

Because starting and switching traffic are two separate moments. The new version comes up and is verified at leisure while nobody uses it; the deployment itself is only the target change in the balancer, which is immediate. And that is why going back is immediate too.

</details>

## Keep exploring

- [nginx · load balancing](https://nginx.org/en/docs/http/load_balancing.html) — the distribution methods and their configuration.
- [The Twelve-Factor App · processes](https://12factor.net/processes) — why state does not live inside the process.
