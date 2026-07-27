---
title: Practice · from empty VPS to HTTPS
description: Walk the whole path on a real machine, from the first connection to a valid certificate.
type: practice
level: beginner
module: server
tools: [ssh, ufw, systemd, nginx, certbot]
prerequisites: [server.processes, server.proxy-tls]
learningObjectives:
  - Leave a freshly created VPS with key-based access and a closed firewall.
  - Publish an application as a systemd service that survives a reboot.
  - Put a reverse proxy in front of it with an issued, renewable certificate.
takeaways:
  - Each step leaves a checkable signal before you move to the next.
  - Rebooting the machine is the proof that the service belongs to the system.
  - Everything you did by hand here is what you will later want automated.
---

## Goal

Start from an empty VPS and end with an application answering at `https://your-domain` as a system service, with the certificate issued and its renewal scheduled.

## Requirements

- A freshly created VPS running Ubuntu 24.04 or Debian 12, and its public IP.
- A domain whose `A` record already points at that IP. **Check this before starting**: without DNS resolving, the certificate step cannot work.
- A terminal with `ssh` and `ssh-keygen`.
- About 45 minutes.

The commands use `myapp` and `your-domain.com`; substitute your own.

## Step 1 · Log in and create your user

```bash
ssh-keygen -t ed25519 -C "atlas-practice"     # on your machine, if you have no key yet
ssh-copy-id root@YOUR_IP
ssh root@YOUR_IP
```

Once inside:

```bash
adduser marta
usermod -aG sudo marta
rsync --archive --chown=marta:marta ~/.ssh /home/marta
```

**Signal:** from a second terminal, `ssh marta@YOUR_IP` logs in without asking for a password. Do not close this first session until you have checked that.

## Step 2 · Close access and ports

```bash
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Signal:** `sudo ufw status verbose` shows `deny (incoming)` and only three allowed rules. Log in again from another terminal to confirm you still have access.

## Step 3 · A minimal application

No repository involved, so the step is about the server rather than about your project:

```bash
sudo apt update && sudo apt install -y nodejs
sudo mkdir -p /srv/myapp && sudo chown marta:marta /srv/myapp
cat > /srv/myapp/server.js <<'EOF'
const http = require('http');
const port = process.env.PORT || 8080;
http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end('{"status":"ok"}');
  }
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end(`served by ${process.pid}\n`);
}).listen(port, '127.0.0.1', () => console.log(`listening on ${port}`));
EOF
```

Note the `'127.0.0.1'` in `listen`: the application is not reachable from outside, only through the proxy.

```bash
printf 'PORT=8080\n' | sudo tee /etc/myapp.env > /dev/null
sudo chmod 600 /etc/myapp.env
```

**Signal:** `node /srv/myapp/server.js` starts and, from another terminal, `curl -s localhost:8080/health` returns `{"status":"ok"}`. Stop the process with `Ctrl+C`.

## Step 4 · Turn it into a service

```bash
sudo tee /etc/systemd/system/myapp.service > /dev/null <<'EOF'
[Unit]
Description=Atlas practice
After=network-online.target

[Service]
Type=simple
User=marta
WorkingDirectory=/srv/myapp
EnvironmentFile=/etc/myapp.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now myapp
systemctl status myapp
```

**Signal:** the status says `active (running)` and `curl -s localhost:8080/health` answers after you close and reopen your SSH session.

Now the check that really separates a service from a process of yours:

```bash
sudo reboot
# wait a minute, log back in
curl -s localhost:8080/health
```

If it answers after the reboot, `enable` did its job.

## Step 5 · The proxy in front

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/myapp > /dev/null <<'EOF'
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

sudo ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

**Signal:** `curl -s http://your-domain.com/health` answers from your own machine, not from the server.

## Step 6 · The certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot asks for an email, obtains the certificate, and edits your nginx block to add the TLS and the redirect from port 80.

**Signal:** `curl -sI https://your-domain.com/health` returns `200`, and `curl -sI http://your-domain.com/health` returns `301` towards HTTPS.

## Step 7 · Check the renewal

This is the step everybody skips and the one that causes the outage three months later:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

**Signal:** a timer is scheduled and the rehearsal finishes without errors.

## What you have just done by hand

Note how long it took and how many steps carried a value only you knew: the user name, the path, the port, the domain. That list is the entire argument of the modules that follow.

| What you did by hand | What automates it |
| --- | --- |
| Installing the runtime at the right version | [Containers](/en/containers/) |
| Checking the code works before uploading it | [Continuous integration](/en/integration/) |
| Copying the code across and restarting the service | [From build to release](/en/deployment/pipeline/) |
| Accepting a few seconds of downtime on update | [Deployment strategies](/en/deployment/strategies/) |

:::note[This guide does not check your work]
The signals in each step are for you to verify. This site runs nothing and validates no result.
:::

## Keep exploring

- [Ubuntu · server documentation](https://ubuntu.com/server/docs) — the official docs for the system you just configured.
- [Certbot · instructions](https://certbot.eff.org/instructions) — the exact steps for your system and proxy combination.
