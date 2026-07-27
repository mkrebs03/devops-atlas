// @ts-check

/**
 * Display names for every tool slug used in page frontmatter.
 *
 * Frontmatter keeps lowercase slugs so authors never think about casing;
 * this map holds the one official spelling of each project, which is what
 * the A–Z index, the per-page tool chips and the landing cards render.
 * `scripts/validate-content.mjs` rejects any frontmatter slug missing here.
 */

/** @type {Readonly<Record<string, string>>} */
export const toolNames = Object.freeze({
  apt: 'APT',
  bash: 'Bash',
  caddy: 'Caddy',
  certbot: 'Certbot',
  cron: 'cron',
  curl: 'curl',
  dns: 'DNS',
  docker: 'Docker',
  'docker-compose': 'Docker Compose',
  git: 'Git',
  github: 'GitHub',
  'github-actions': 'GitHub Actions',
  http: 'HTTP',
  linux: 'Linux',
  nginx: 'nginx',
  node: 'Node.js',
  opentelemetry: 'OpenTelemetry',
  prometheus: 'Prometheus',
  postgresql: 'PostgreSQL',
  python: 'Python',
  rsync: 'rsync',
  ss: 'ss',
  ssh: 'SSH',
  systemd: 'systemd',
  tls: 'TLS',
  traefik: 'Traefik',
  ufw: 'ufw',
  yaml: 'YAML',
});
