import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import { modules } from './src/data/curriculum.mjs';
import { rehypeDetailsBody } from './plugins/rehype-details-body.mjs';
import { rehypeTableWrap } from './plugins/rehype-table-wrap.mjs';

const moduleSidebar = modules.map((module) => ({
  label: module.sidebarLabel.es,
  translations: { en: module.sidebarLabel.en },
  items: module.pages.map((page) => ({
    label: page.label.es,
    translations: { en: page.label.en },
    link: `/${page.relativePath}`,
  })),
}));

/*
  Astro only reads .env files after this config has been evaluated, so `site`
  has to load its own — otherwise a PUBLIC_SITE_URL set in .env, as the README
  documents, would be silently ignored. Vite's loadEnv is the usual tool, but
  `vite` is not importable from here under pnpm's strict layout without
  declaring it a dependency, so the file is read by hand.
*/
const dotEnv = (() => {
  try {
    return Object.fromEntries(
      readFileSync(new URL('.env', import.meta.url), 'utf8')
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/))
        .filter((match) => match !== null)
        .map(([, key, value]) => [key, value.replace(/^(['"])(.*)\1$/, '$2')]),
    );
  } catch {
    return {};
  }
})();

export default defineConfig({
  site: dotEnv.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  /*
    Old URLs stay reachable. Two rounds of restructuring are recorded here:

    "Linux y terminal" was split into a page about the system and a page about
    the shell, so an old link lands on the shell half.

    Then the taxonomy moved from grouping by tool category to grouping by the
    state of the system: `delivery` became `containers`, everything about
    automated checks moved to `integration`, and the branching model left
    Collaboration for the module that actually decides it. `github-flow` points
    at `pull-requests` because that is where its text went; the strategy half is
    a new page rather than a move.
  */
  redirects: {
    '/foundations/linux-cli/': '/foundations/terminal/',
    '/en/foundations/linux-cli/': '/en/foundations/terminal/',
    '/collaboration/github-flow/': '/collaboration/pull-requests/',
    '/en/collaboration/github-flow/': '/en/collaboration/pull-requests/',
    '/delivery/': '/containers/',
    '/en/delivery/': '/en/containers/',
    '/delivery/docker/': '/containers/docker/',
    '/en/delivery/docker/': '/en/containers/docker/',
    '/delivery/lab-container-pipeline/': '/containers/lab-container-pipeline/',
    '/en/delivery/lab-container-pipeline/': '/en/containers/lab-container-pipeline/',
    '/delivery/github-actions/': '/integration/github-actions/',
    '/en/delivery/github-actions/': '/en/integration/github-actions/',
    '/testing/in-ci/': '/integration/tests-in-ci/',
    '/en/testing/in-ci/': '/en/integration/tests-in-ci/',
  },
  markdown: {
    // Gives every <details> in the content a single body element, which is what
    // lets it open by growing rather than in one frame, and wraps every table so
    // a wide one scrolls in place instead of stretching the page. See each plugin.
    processor: unified({
      rehypePlugins: [rehypeDetailsBody, rehypeTableWrap],
    }),
  },
  vite: {
    build: {
      // Mermaid minifies to a ~650 kB chunk (plus cytoscape and katex), past
      // the bundler's 500 kB warning. It is fetched with a dynamic import()
      // only on pages that actually contain a diagram (see MermaidRunner), so
      // the size is deliberate: raise the warning limit instead of re-splitting
      // a dependency that is already split.
      chunkSizeWarningLimit: 700,
    },
  },
  integrations: [
    starlight({
      title: 'DevOps Atlas',
      // The code box stays dark in both themes (--atlas-code-bg), so pin syntax
      // highlighting to one dark theme. Starlight's default pair swaps to a light
      // palette under [data-theme='light'] and would put light ink on the dark box.
      expressiveCode: {
        themes: ['starlight-dark'],
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Español',
          lang: 'es',
        },
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      customCss: [
        './src/styles/fonts.css',
        './src/styles/tokens.css',
        './src/styles/shell.css',
        './src/styles/page.css',
        './src/styles/landing.css',
      ],
      components: {
        Header: './src/components/starlight/AtlasHeader.astro',
        PageTitle: './src/components/starlight/AtlasPageTitle.astro',
        Footer: './src/components/starlight/AtlasFooter.astro',
        TableOfContents: './src/components/starlight/AtlasTableOfContents.astro',
      },
      sidebar: [
        {
          label: 'Qué es DevOps',
          translations: { en: 'What DevOps is' },
          link: '/what-is-devops/',
        },
        {
          label: 'Herramientas A–Z',
          translations: { en: 'Tools A–Z' },
          link: '/tools/',
        },
        {
          label: 'Glosario',
          translations: { en: 'Glossary' },
          link: '/glossary/',
        },
        ...moduleSidebar,
      ],
    }),
  ],
});
