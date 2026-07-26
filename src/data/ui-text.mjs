// @ts-check
/** Interface strings. Spanish and English are peers; neither is a fallback.
 *
 * Division of labour: src/content/i18n/es.json holds only the keys Starlight
 * itself consumes (search dialog, stock footer, skip links…); this file holds
 * every string rendered by the project's own components.
 */

/** @typedef {'es' | 'en'} Locale */

const text = Object.freeze({
  es: Object.freeze({
    tools: 'Herramientas A–Z',
    modules: 'Módulos',
    pages: 'páginas',
    practices: 'prácticas',
    language: 'Idioma',
    switchTheme: 'Cambiar tema',
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
    readingOrder: 'Páginas del módulo',
  }),
  en: Object.freeze({
    tools: 'Tools A–Z',
    modules: 'Modules',
    pages: 'pages',
    practices: 'practices',
    language: 'Language',
    switchTheme: 'Switch theme',
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
    readingOrder: 'Module pages',
  }),
});

/** @param {string | undefined} lang @returns {Locale} */
export const localeOf = (lang) => (lang === 'en' || lang?.startsWith('en') ? 'en' : 'es');

/** @param {Locale} locale */
export const t = (locale) => text[locale];
