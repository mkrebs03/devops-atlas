// @ts-check

/**
 * Content taxonomy for the Atlas reference.
 *
 * This file describes *what exists and how it is grouped* — nothing else.
 * There is no progress model: page order inside a module is a suggested
 * reading order, never a gate, and the site stores no reader state.
 */

/**
 * The taxonomy enums, in one place. `src/content.config.ts` builds its zod
 * enums from these and `scripts/validate-content.mjs` checks against them,
 * so adding a module or a level here is the whole change.
 */
export const MODULE_IDS = /** @type {const} */ (['foundations', 'collaboration', 'delivery', 'testing', 'deployment']);
/** Frontmatter `type` values. `overview` is a curriculum kind, not a frontmatter type. */
export const PAGE_TYPES = /** @type {const} */ (['concept', 'tool', 'practice', 'cheatsheet']);
export const LEVELS = /** @type {const} */ (['beginner', 'intermediate', 'advanced']);

/** @typedef {'es' | 'en'} Locale */
/** @typedef {typeof MODULE_IDS[number]} ModuleId */
/** @typedef {'overview' | typeof PAGE_TYPES[number]} PageKind */
/** @typedef {{ es: string, en: string }} LocalizedText */
/**
 * @typedef {Readonly<{
 *   id: string,
 *   module: ModuleId,
 *   order: number,
 *   relativePath: string,
 *   kind: PageKind,
 *   prerequisites: readonly string[],
 *   label: Readonly<LocalizedText>,
 * }>} Page
 */
/**
 * @typedef {Readonly<{
 *   id: ModuleId,
 *   order: number,
 *   label: Readonly<LocalizedText>,
 *   sidebarLabel: Readonly<LocalizedText>,
 *   summary: Readonly<LocalizedText>,
 *   tools: readonly string[],
 *   pages: readonly Page[],
 * }>} Module
 */

/** @param {LocalizedText} value */
const localized = (value) => Object.freeze(value);

/** @param {Omit<Page, 'prerequisites' | 'label'> & { prerequisites: string[], label: LocalizedText }} value */
const page = (value) => Object.freeze({
  ...value,
  prerequisites: Object.freeze(value.prerequisites),
  label: localized(value.label),
});

/** @type {readonly Module[]} */
export const modules = Object.freeze([
  Object.freeze({
    id: 'foundations',
    order: 1,
    label: localized({ es: 'Fundamentos', en: 'Foundations' }),
    sidebarLabel: localized({ es: '01 · Fundamentos', en: '01 · Foundations' }),
    summary: localized({
      es: 'La máquina, la terminal y el recorrido de una petición.',
      en: 'The machine, the terminal, and the path of a request.',
    }),
    tools: Object.freeze(['Linux', 'Bash', 'curl', 'ss']),
    pages: Object.freeze([
      page({
        id: 'foundations.overview', module: 'foundations', order: 1,
        relativePath: 'foundations/', kind: 'overview',
        prerequisites: [], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'foundations.linux', module: 'foundations', order: 2,
        relativePath: 'foundations/linux/', kind: 'concept',
        prerequisites: [], label: { es: 'Linux', en: 'Linux' },
      }),
      page({
        id: 'foundations.terminal', module: 'foundations', order: 3,
        relativePath: 'foundations/terminal/', kind: 'concept',
        prerequisites: ['foundations.linux'], label: { es: 'La terminal', en: 'The terminal' },
      }),
      page({
        id: 'foundations.networking', module: 'foundations', order: 4,
        relativePath: 'foundations/networking/', kind: 'concept',
        prerequisites: ['foundations.terminal'], label: { es: 'Redes esenciales', en: 'Essential networking' },
      }),
      page({
        id: 'foundations.lab-shell-and-network', module: 'foundations', order: 5,
        relativePath: 'foundations/lab-shell-and-network/', kind: 'practice',
        prerequisites: ['foundations.terminal', 'foundations.networking'],
        label: { es: 'Práctica · investigar una aplicación local', en: 'Practice · investigate a local application' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'collaboration',
    order: 2,
    label: localized({ es: 'Colaboración', en: 'Collaboration' }),
    sidebarLabel: localized({ es: '02 · Colaboración', en: '02 · Collaboration' }),
    summary: localized({
      es: 'Convertir cambios individuales en decisiones revisables y compartidas.',
      en: 'Turning individual changes into reviewable, shared decisions.',
    }),
    tools: Object.freeze(['Git', 'GitHub']),
    pages: Object.freeze([
      page({
        id: 'collaboration.overview', module: 'collaboration', order: 6,
        relativePath: 'collaboration/', kind: 'overview',
        prerequisites: ['foundations.terminal'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'collaboration.git-model', module: 'collaboration', order: 7,
        relativePath: 'collaboration/git-model/', kind: 'concept',
        prerequisites: ['foundations.terminal'], label: { es: 'El modelo de Git', en: 'The Git model' },
      }),
      page({
        id: 'collaboration.github-flow', module: 'collaboration', order: 8,
        relativePath: 'collaboration/github-flow/', kind: 'tool',
        prerequisites: ['collaboration.git-model'], label: { es: 'GitHub Flow', en: 'GitHub Flow' },
      }),
      page({
        id: 'collaboration.lab-git-branching', module: 'collaboration', order: 9,
        relativePath: 'collaboration/lab-git-branching/', kind: 'practice',
        prerequisites: ['collaboration.git-model'],
        label: { es: 'Práctica · ramas seguras', en: 'Practice · safe branches' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'delivery',
    order: 3,
    label: localized({ es: 'Entrega', en: 'Delivery' }),
    sidebarLabel: localized({ es: '03 · Entrega', en: '03 · Delivery' }),
    summary: localized({
      es: 'Empaquetar, automatizar y comprobar cambios con confianza.',
      en: 'Packaging, automating, and checking changes with confidence.',
    }),
    tools: Object.freeze(['Docker', 'Docker Compose', 'GitHub Actions', 'nginx']),
    pages: Object.freeze([
      page({
        id: 'delivery.overview', module: 'delivery', order: 10,
        relativePath: 'delivery/', kind: 'overview',
        prerequisites: ['collaboration.git-model', 'foundations.networking'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'delivery.docker', module: 'delivery', order: 11,
        relativePath: 'delivery/docker/', kind: 'tool',
        prerequisites: ['foundations.terminal', 'foundations.networking'], label: { es: 'Docker sin magia', en: 'Docker without magic' },
      }),
      page({
        id: 'delivery.github-actions', module: 'delivery', order: 12,
        relativePath: 'delivery/github-actions/', kind: 'tool',
        prerequisites: ['collaboration.github-flow'], label: { es: 'GitHub Actions', en: 'GitHub Actions' },
      }),
      page({
        id: 'delivery.lab-container-pipeline', module: 'delivery', order: 13,
        relativePath: 'delivery/lab-container-pipeline/', kind: 'practice',
        prerequisites: ['delivery.docker', 'foundations.networking'],
        label: { es: 'Práctica · pipeline local', en: 'Practice · local pipeline' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'testing',
    order: 4,
    label: localized({ es: 'Pruebas', en: 'Testing' }),
    sidebarLabel: localized({ es: '04 · Pruebas', en: '04 · Testing' }),
    summary: localized({
      es: 'Convertir la confianza en evidencia con pruebas automáticas.',
      en: 'Turning confidence into evidence with automated tests.',
    }),
    tools: Object.freeze(['Node.js', 'GitHub Actions']),
    pages: Object.freeze([
      page({
        id: 'testing.overview', module: 'testing', order: 14,
        relativePath: 'testing/', kind: 'overview',
        prerequisites: ['collaboration.github-flow'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'testing.pyramid', module: 'testing', order: 15,
        relativePath: 'testing/pyramid/', kind: 'concept',
        prerequisites: [], label: { es: 'La pirámide de pruebas', en: 'The testing pyramid' },
      }),
      page({
        id: 'testing.in-ci', module: 'testing', order: 16,
        relativePath: 'testing/in-ci/', kind: 'tool',
        prerequisites: ['delivery.github-actions'], label: { es: 'Pruebas en CI', en: 'Tests in CI' },
      }),
      page({
        id: 'testing.lab-first-test', module: 'testing', order: 17,
        relativePath: 'testing/lab-first-test/', kind: 'practice',
        prerequisites: ['testing.pyramid'],
        label: { es: 'Práctica · tu primera prueba', en: 'Practice · your first test' },
      }),
    ]),
  }),
  Object.freeze({
    id: 'deployment',
    order: 5,
    label: localized({ es: 'Despliegue', en: 'Deployment' }),
    sidebarLabel: localized({ es: '05 · Despliegue', en: '05 · Deployment' }),
    summary: localized({
      es: 'Llevar un artefacto a producción y poder revertirlo.',
      en: 'Taking an artifact to production — and being able to roll it back.',
    }),
    tools: Object.freeze(['nginx', 'Caddy', 'Traefik', 'Prometheus']),
    pages: Object.freeze([
      page({
        id: 'deployment.overview', module: 'deployment', order: 18,
        relativePath: 'deployment/', kind: 'overview',
        prerequisites: ['delivery.github-actions'], label: { es: 'Panorama', en: 'Overview' },
      }),
      page({
        id: 'deployment.pipeline', module: 'deployment', order: 19,
        relativePath: 'deployment/pipeline/', kind: 'concept',
        prerequisites: ['delivery.github-actions'], label: { es: 'Del build al release', en: 'From build to release' },
      }),
      page({
        id: 'deployment.proxy', module: 'deployment', order: 20,
        relativePath: 'deployment/proxy/', kind: 'concept',
        prerequisites: ['foundations.networking'],
        label: { es: 'Proxy inverso y balanceo', en: 'Reverse proxy and load balancing' },
      }),
      page({
        id: 'deployment.strategies', module: 'deployment', order: 21,
        relativePath: 'deployment/strategies/', kind: 'concept',
        prerequisites: ['deployment.proxy'], label: { es: 'Estrategias de despliegue', en: 'Deployment strategies' },
      }),
      page({
        id: 'deployment.observability', module: 'deployment', order: 22,
        relativePath: 'deployment/observability/', kind: 'concept',
        prerequisites: ['deployment.proxy'],
        label: { es: 'Observabilidad', en: 'Observability' },
      }),
      page({
        id: 'deployment.lab-release', module: 'deployment', order: 23,
        relativePath: 'deployment/lab-release/', kind: 'practice',
        prerequisites: ['deployment.pipeline'],
        label: { es: 'Práctica · promover y revertir', en: 'Practice · promote and roll back' },
      }),
    ]),
  }),
]);

/** @type {readonly Page[]} */
export const pages = Object.freeze(modules.flatMap((module) => module.pages));

const pagesById = new Map(pages.map((item) => [item.id, item]));
/** @type {Map<string, Module>} */
const modulesById = new Map(modules.map((item) => [item.id, item]));
const pagesByPath = new Map(pages.map((item) => [item.relativePath, item]));

/** @param {string} id @returns {Page | undefined} */
export const getPage = (id) => pagesById.get(id);

/** @param {string} id @returns {Module | undefined} */
export const getModule = (id) => modulesById.get(id);

/**
 * Resolves either locale's URL path to the shared canonical page.
 * @param {string} value
 * @returns {Page | undefined}
 */
export function getPageByPath(value) {
  const pathname = value.split(/[?#]/, 1)[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/^en\//, '')
    .replace(/index(?:\.html)?$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '');
  return pagesByPath.get(`${pathname}/`);
}

/** @param {Page | string} value @param {Locale} locale @returns {string | undefined} */
export function getLocalizedPath(value, locale) {
  const resolved = typeof value === 'string' ? getPage(value) : value;
  if (!resolved) return undefined;
  return `/${locale === 'en' ? 'en/' : ''}${resolved.relativePath}`;
}

/**
 * Suggested reading neighbours across the whole reference. Purely advisory:
 * nothing is locked, and skipping ahead is a supported way to use the site.
 * @param {Page | string} value
 * @returns {{ previous?: Page, next?: Page }}
 */
export function getNeighbours(value) {
  const resolved = typeof value === 'string' ? getPage(value) : value;
  if (!resolved) return {};
  const index = pages.findIndex((item) => item.id === resolved.id);
  return {
    ...(index > 0 ? { previous: pages[index - 1] } : {}),
    ...(index >= 0 && index < pages.length - 1 ? { next: pages[index + 1] } : {}),
  };
}

/**
 * Pages that share at least one tool with the given one, nearest module first.
 * Feeds the "related" links at the foot of a page.
 * @param {Page | string} value
 * @param {Map<string, readonly string[]>} toolsByPageId
 * @returns {readonly Page[]}
 */
export function getRelatedPages(value, toolsByPageId) {
  const resolved = typeof value === 'string' ? getPage(value) : value;
  if (!resolved) return Object.freeze([]);
  const own = new Set((toolsByPageId.get(resolved.id) ?? []).map((tool) => tool.toLowerCase()));
  if (own.size === 0) return Object.freeze([]);
  const scored = pages
    .filter((item) => item.id !== resolved.id)
    .map((item) => {
      const shared = (toolsByPageId.get(item.id) ?? [])
        .filter((tool) => own.has(tool.toLowerCase())).length;
      return { item, shared };
    })
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared
      || Number(b.item.module === resolved.module) - Number(a.item.module === resolved.module)
      || a.item.order - b.item.order);
  return Object.freeze(scored.map((entry) => entry.item));
}
