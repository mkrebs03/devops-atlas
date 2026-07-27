---
title: Glossary
description: The terms used across the Atlas, defined in one line, each pointing at the page that explains it properly.
---

Every term is defined where it is first needed inside its own page. This is the shortcut: the minimum definition to keep you reading, plus the link to where it is explained in full. For specific tools, use the [A–Z tools index](/en/tools/).

**Alert** — An automated notice that somebody is suffering something and there is something to do. Defined on symptoms, not on causes. → [Observability](/en/deployment/observability/)

**Approval gate** — The point where a person explicitly authorises the step into production. It is the only thing separating continuous delivery from continuous deployment. → [From build to release](/en/deployment/pipeline/)

**Artifact** — The packaged result of a build: a container image, a `.jar`, a folder of static files. It is what gets deployed, and it is not the code it came from. → [Continuous integration](/en/integration/)

**Blue-green** — A deployment strategy with two complete environments: one serves traffic while the other receives the new version. The switch is instant, and so is going back. → [Deployment strategies](/en/deployment/strategies/)

**Branch** — A movable reference naming a line of commits. It isolates one concrete intention for a short time. → [The Git model](/en/collaboration/git-model/)

**Canary** — A deployment strategy that exposes the new version to a fraction of traffic and only widens it if the metrics stay healthy. → [Deployment strategies](/en/deployment/strategies/)

**CD** — Continuous delivery: the artifact is always ready to deploy. Continuous deployment: that last step also happens on its own once the checks pass. → [From build to release](/en/deployment/pipeline/)

**CI** — Continuous integration: every proposed change is integrated and validated automatically on a clean server, not only on the machine of whoever wrote it. → [Tests in CI](/en/integration/tests-in-ci/)

**Commit** — A snapshot of the project that points at its predecessor. The smallest unit of history. → [The Git model](/en/collaboration/git-model/)

**Conflict** — The moment two branches change the same line and Git stops so that you decide. Not an error: a delegated decision. → [The Git model](/en/collaboration/git-model/)

**Container** — A process created from an image, with its own runtime environment. It is disposable; its data should not be. → [Docker without magic](/en/containers/docker/)

**Coverage** — The percentage of your code that the tests execute. It measures lines travelled, not behaviour verified. → [Tests in CI](/en/integration/tests-in-ci/)

**Distribution** — A complete Linux system: the kernel packaged with base programs, a package manager, and a version policy. Debian, Ubuntu, Alpine. → [Linux](/en/foundations/linux/)

**DNS** — The system that translates a name into addresses. It does not carry your request; it only says where to go. → [Essential networking](/en/foundations/networking/)

**Docker Compose** — The file that describes several containers and the network they share, instead of chaining `docker run` commands. → [Docker without magic](/en/containers/docker/)

**End-to-end test (E2E)** — Tests the system the way a person uses it. Slow and valuable: it answers whether the whole route works. → [The testing pyramid](/en/testing/pyramid/)

**Environment** — A complete installation of the system with its own configuration and data: development, staging, production. → [Continuous integration](/en/integration/)

**Feature flag** — A condition in the code that decides at runtime whether a feature is active. It separates deploying the code from enabling the feature. → [Branching strategies](/en/integration/branching-strategy/)

**Firewall** — A filter that decides which connections are accepted before they reach the process. It explains why a connection hangs instead of being refused. → [Essential networking](/en/foundations/networking/)

**Flaky test** — A test that fails for reasons unrelated to behaviour: a timeout, a changed selector, a random value. It costs more than it protects. → [The testing pyramid](/en/testing/pyramid/)

**Gateway** — A network's way out: where a machine hands packets whose destination falls outside its own subnet. → [Essential networking](/en/foundations/networking/)

**GitFlow** — A branching model with permanent `main` and `develop` branches plus `feature/*`, `release/*` and `hotfix/*`. It earns its cost only if you support several published versions at once. → [Branching strategies](/en/integration/branching-strategy/)

**Group** — A shared identity that lets several users reach the same things. The middle triplet in a file's permissions. → [Linux](/en/foundations/linux/)

**HEAD** — The reference that says where you are working right now: the commit the next one will be built on. → [The Git model](/en/collaboration/git-model/)

**Health check** — The periodic check a balancer makes to know whether an instance can serve, and to pull it out of rotation if it cannot. → [Reverse proxy and load balancing](/en/deployment/proxy/)

**Image** — An immutable package of layers that containers are created from. Identified by tag, and in production by SHA. → [Docker without magic](/en/containers/docker/)

**Integration test** — Tests that several pieces cooperate, for example code plus a database. It answers whether they fit together. → [The testing pyramid](/en/testing/pyramid/)

**IP** — A machine's address on the network: the number packets must be sent to in order to arrive. → [Essential networking](/en/foundations/networking/)

**Issue** — The unit that records outstanding work — a bug, an improvement — with its discussion and its number. → [Pull requests and review](/en/collaboration/pull-requests/)

**Job** — One unit of a workflow, running on its own machine. Jobs run in parallel unless you declare dependencies with `needs`. → [GitHub Actions](/en/integration/github-actions/)

**Lint** — The cheapest check there is: a program reads the code without running it and flags whatever breaks a convention or smells like a bug. → [GitHub Actions](/en/integration/github-actions/)

**Load balancing** — Spreading requests across several identical instances of the same service. → [Reverse proxy and load balancing](/en/deployment/proxy/)

**Log** — The event-by-event record of what the system did. Structured and carrying a correlation id, it reconstructs one specific case. → [Observability](/en/deployment/observability/)

**Merge** — Integrating one branch into another with a commit that joins both lines and keeps the history as it happened. → [The Git model](/en/collaboration/git-model/)

**Metric** — A number measured over time: requests per second, errors per minute, milliseconds to respond. Cheap to keep and good for alerts. → [Observability](/en/deployment/observability/)

**Observability** — Being able to answer questions you did not anticipate about what the system is doing, without deploying new code to find out. → [Observability](/en/deployment/observability/)

**Percentile** — The value below which a given share of measurements falls. The p99 describes the worst real experience better than any average. → [Observability](/en/deployment/observability/)

**Pipeline** — The automated sequence of stages a change travels from commit to published. → [Continuous integration](/en/integration/)

**Port** — The number that decides which of a machine's programs each connection enters. → [Essential networking](/en/foundations/networking/)

**Private address** — An IP valid only inside one particular network —`10.x`, `172.16–31.x`, `192.168.x`— and meaningless outside it. → [Essential networking](/en/foundations/networking/)

**Production** — The environment where the real users are. The only one where a failure happens to somebody. → [Continuous integration](/en/integration/)

**Protected branch** — A branch with rules: require review, require CI to pass, forbid direct pushes. It turns the team's agreements into something enforced. → [Pull requests and review](/en/collaboration/pull-requests/)

**Pull request** — The surface where a change is proposed, its intent explained, and its diff reviewed before integration. → [Pull requests and review](/en/collaboration/pull-requests/)

**Rebase** — Reapplying your commits onto another base to get a linear history. It rewrites identifiers, so it belongs to private history. → [The Git model](/en/collaboration/git-model/)

**Recreate** — A deployment strategy that switches the old version off and the new one on. Simple, but with downtime. → [Deployment strategies](/en/deployment/strategies/)

**Registry** — The remote repository where images are published and from which servers pull them. Docker Hub, GHCR, your cloud's own. → [Docker without magic](/en/containers/docker/)

**Remote** — A reference to another copy of the repository. `fetch` brings its information; `pull` combines it with your local branch. → [The Git model](/en/collaboration/git-model/)

**Reverse proxy** — The server that receives all traffic and distributes it among your services. Where the TLS certificate and the routing decision live. → [Reverse proxy and load balancing](/en/deployment/proxy/)

**Rollback** — Going back to the previous version. What makes a deployment reversible, and what is worth rehearsing before you need it. → [Deployment strategies](/en/deployment/strategies/)

**Rolling** — A deployment strategy that replaces instances a few at a time: no downtime, but two versions coexist for a while. → [Deployment strategies](/en/deployment/strategies/)

**Runner** — The machine that executes a job. Created clean and destroyed when it ends, so nothing survives between runs. → [GitHub Actions](/en/integration/github-actions/)

**Secret** — A value that grants access to something: a token, an API key, a deployment password. It never lives in the repository. → [GitHub Actions](/en/integration/github-actions/)

**Service** — A process the system starts at boot, restarts if it dies, and logs for you. → [Linux](/en/foundations/linux/)

**SHA** — The cryptographic fingerprint of content. As an image identifier, it guarantees the exact same bytes every time. → [Docker without magic](/en/containers/docker/)

**Smoke test** — The minimum check that a version is alive: the health endpoint answers, the page loads, the database connects. → [From build to release](/en/deployment/pipeline/)

**Socket** — The IP + port pair: the real address a client connects to. → [Essential networking](/en/foundations/networking/)

**Staging area** — The intermediate step between your files and the commit, where `git add` places what you actually want to keep. It is why there are two different diffs. → [The Git model](/en/collaboration/git-model/)

**Subnet** — The stretch of addresses that count as "my network". The mask (`/24`) marks where it ends, and with it whether a destination is reached directly or through the gateway. → [Essential networking](/en/foundations/networking/)

**TLS** — The layer that encrypts the connection and proves the server is who it claims to be. The `s` in HTTPS. → [Essential networking](/en/foundations/networking/)

**Trace** — One request's path across every service it passes through, with the time spent on each leg. → [Observability](/en/deployment/observability/)

**Trunk-based** — A branching model where everyone integrates into `main` at least once a day and unfinished work travels switched off behind a feature flag. → [Branching strategies](/en/integration/branching-strategy/)

**Unit test** — Tests one function or module in isolation. Fast, precise and cheap: the base of the pyramid. → [The testing pyramid](/en/testing/pyramid/)

**Volume** — Storage that lives outside the container and survives its deletion. Where the data you cannot lose goes. → [Docker without magic](/en/containers/docker/)

**Workflow** — The description of what should happen on a repository event: which jobs run, in which order, and with which permissions. → [GitHub Actions](/en/integration/github-actions/)
