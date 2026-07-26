// @ts-check
/** Interface strings. Spanish and English are peers; neither is a fallback. */

/** @typedef {'es' | 'en'} Locale */

const text = Object.freeze({
  es: Object.freeze({
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar una página, herramienta o comando',
    index: 'Índice',
    tools: 'Herramientas A–Z',
    modules: 'Módulos',
    pages: 'páginas',
    module: 'Módulo',
    kind: Object.freeze({
      overview: 'Panorama', concept: 'Concepto', tool: 'Herramienta',
      practice: 'Práctica', cheatsheet: 'Chuleta',
    }),
    level: Object.freeze({ beginner: 'Inicial', intermediate: 'Intermedio', advanced: 'Avanzado' }),
    before: 'Conviene saber antes',
    related: 'Relacionadas',
    next: 'Siguiente',
    previous: 'Anterior',
    inThisModule: 'En este módulo',
    usedIn: 'Aparece en',
    toolsIntro: 'Cada herramienta y tecnología del Atlas, con las páginas donde se usa.',
    readingOrder: 'Páginas del módulo',
  }),
  en: Object.freeze({
    searchLabel: 'Search',
    searchPlaceholder: 'Search a page, tool, or command',
    index: 'Index',
    tools: 'Tools A–Z',
    modules: 'Modules',
    pages: 'pages',
    module: 'Module',
    kind: Object.freeze({
      overview: 'Overview', concept: 'Concept', tool: 'Tool',
      practice: 'Practice', cheatsheet: 'Cheatsheet',
    }),
    level: Object.freeze({ beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }),
    before: 'Worth knowing first',
    related: 'Related',
    next: 'Next',
    previous: 'Previous',
    inThisModule: 'In this module',
    usedIn: 'Appears in',
    toolsIntro: 'Every tool and technology in the Atlas, with the pages that use it.',
    readingOrder: 'Module pages',
  }),
});

/** @param {string | undefined} lang @returns {Locale} */
export const localeOf = (lang) => (lang === 'en' || lang?.startsWith('en') ? 'en' : 'es');

/** @param {Locale} locale */
export const t = (locale) => text[locale];
