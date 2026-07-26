---
title: Glossary
description: The terms used across the Atlas, defined in one line, each pointing at the page that explains it properly.
---

Every term is defined where it is first needed inside its own page. This is the shortcut: the minimum definition to keep you reading, plus the link to where it is explained in full. For specific tools, use the [A–Z tools index](/en/tools/).

**Approval gate** — The point where a person explicitly authorises the step into production. It is the only thing separating continuous delivery from continuous deployment. → [From build to release](/en/deployment/pipeline/)

**Artifact** — The packaged result of a build: a container image, a `.jar`, a folder of static files. It is what gets deployed, and it is not the code it came from. → [Delivery](/en/delivery/)

**Blue-green** — A deployment strategy with two complete environments: one serves traffic while the other receives the new version. The switch is instant, and so is going back. → [Deployment strategies](/en/deployment/strategies/)

**Branch** — A movable reference naming a line of commits. It isolates one concrete intention for a short time. → [The Git model](/en/collaboration/git-model/)

**Canary** — A deployment strategy that exposes the new version to a fraction of traffic and only widens it if the metrics stay healthy. → [Deployment strategies](/en/deployment/strategies/)

**CD** — Continuous delivery: the artifact is always ready to deploy. Continuous deployment: that last step also happens on its own once the checks pass. → [From build to release](/en/deployment/pipeline/)

**CI** — Continuous integration: every proposed change is integrated and validated automatically on a clean server, not only on the machine of whoever wrote it. → [Tests in CI](/en/testing/in-ci/)

**Commit** — A snapshot of the project that points at its predecessor. The smallest unit of history. → [The Git model](/en/collaboration/git-model/)

**Container** — A process created from an image, with its own runtime environment. It is disposable; its data should not be. → [Docker without magic](/en/delivery/docker/)

**Coverage** — The percentage of your code that the tests execute. It measures lines travelled, not behaviour verified. → [Tests in CI](/en/testing/in-ci/)

**Distribution** — A complete Linux system: the kernel packaged with base programs, a package manager, and a version policy. Debian, Ubuntu, Alpine. → [Linux](/en/foundations/linux/)

**DNS** — The system that translates a name into addresses. It does not carry your request; it only says where to go. → [Essential networking](/en/foundations/networking/)

**Environment** — A complete installation of the system with its own configuration and data: development, staging, production. → [Delivery](/en/delivery/)

**Firewall** — A filter that decides which connections are accepted before they reach the process. It explains why a connection hangs instead of being refused. → [Essential networking](/en/foundations/networking/)

**Group** — A shared identity that lets several users reach the same things. The middle triplet in a file's permissions. → [Linux](/en/foundations/linux/)

**Health check** — The periodic check a balancer makes to know whether an instance can serve, and to pull it out of rotation if it cannot. → [Reverse proxy and load balancing](/en/deployment/proxy/)

**Image** — An immutable package of layers that containers are created from. Identified by tag, and in production by SHA. → [Docker without magic](/en/delivery/docker/)

**IP** — A machine's address on the network: the number packets must be sent to in order to arrive. → [Essential networking](/en/foundations/networking/)

**Issue** — The unit that records outstanding work — a bug, an improvement — with its discussion and its number. → [GitHub Flow](/en/collaboration/github-flow/)

**Job** — One unit of a workflow, running on its own machine. Jobs run in parallel unless you declare dependencies with `needs`. → [GitHub Actions](/en/delivery/github-actions/)

**Lint** — The cheapest check there is: a program reads the code without running it and flags whatever breaks a convention or smells like a bug. → [GitHub Actions](/en/delivery/github-actions/)

**Load balancing** — Spreading requests across several identical instances of the same service. → [Reverse proxy and load balancing](/en/deployment/proxy/)

**Merge** — Integrating one branch into another with a commit that joins both lines and keeps the history as it happened. → [The Git model](/en/collaboration/git-model/)

**Pipeline** — The automated sequence of stages a change travels from commit to published. → [Delivery](/en/delivery/)

**Port** — The number that decides which of a machine's programs each connection enters. → [Essential networking](/en/foundations/networking/)

**Production** — The environment where the real users are. The only one where a failure happens to somebody. → [Delivery](/en/delivery/)

**Protected branch** — A branch with rules: require review, require CI to pass, forbid direct pushes. It turns the team's agreements into something enforced. → [GitHub Flow](/en/collaboration/github-flow/)

**Pull request** — The surface where a change is proposed, its intent explained, and its diff reviewed before integration. → [GitHub Flow](/en/collaboration/github-flow/)

**Rebase** — Reapplying your commits onto another base to get a linear history. It rewrites identifiers, so it belongs to private history. → [The Git model](/en/collaboration/git-model/)

**Registry** — The remote repository where images are published and from which servers pull them. Docker Hub, GHCR, your cloud's own. → [Docker without magic](/en/delivery/docker/)

**Reverse proxy** — The server that receives all traffic and distributes it among your services. Where the TLS certificate and the routing decision live. → [Reverse proxy and load balancing](/en/deployment/proxy/)

**Rollback** — Going back to the previous version. What makes a deployment reversible, and what is worth rehearsing before you need it. → [Deployment strategies](/en/deployment/strategies/)

**Runner** — The machine that executes a job. Created clean and destroyed when it ends, so nothing survives between runs. → [GitHub Actions](/en/delivery/github-actions/)

**Secret** — A value that grants access to something: a token, an API key, a deployment password. It never lives in the repository. → [GitHub Actions](/en/delivery/github-actions/)

**Service** — A process the system starts at boot, restarts if it dies, and logs for you. → [Linux](/en/foundations/linux/)

**SHA** — The cryptographic fingerprint of content. As an image identifier, it guarantees the exact same bytes every time. → [Docker without magic](/en/delivery/docker/)

**Smoke test** — The minimum check that a version is alive: the health endpoint answers, the page loads, the database connects. → [From build to release](/en/deployment/pipeline/)

**Socket** — The IP + port pair: the real address a client connects to. → [Essential networking](/en/foundations/networking/)

**Staging area** — The intermediate step between your files and the commit, where `git add` places what you actually want to keep. It is why there are two different diffs. → [The Git model](/en/collaboration/git-model/)

**TLS** — The layer that encrypts the connection and proves the server is who it claims to be. The `s` in HTTPS. → [Essential networking](/en/foundations/networking/)

**Volume** — Storage that lives outside the container and survives its deletion. Where the data you cannot lose goes. → [Docker without magic](/en/delivery/docker/)

**Workflow** — The description of what should happen on a repository event: which jobs run, in which order, and with which permissions. → [GitHub Actions](/en/delivery/github-actions/)
