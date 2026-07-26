import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { modules } from './src/data/curriculum.mjs';

const moduleSidebar = modules.map((module) => ({
  label: module.sidebarLabel.es,
  translations: { en: module.sidebarLabel.en },
  items: module.pages.map((page) => ({
    label: page.label.es,
    translations: { en: page.label.en },
    link: `/${page.relativePath}`,
  })),
}));

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  // "Linux y terminal" was split into a page about the system and a page about
  // the shell. Anyone holding the old link lands on the shell half.
  redirects: {
    '/foundations/linux-cli/': '/foundations/terminal/',
    '/en/foundations/linux-cli/': '/en/foundations/terminal/',
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
        ...moduleSidebar,
      ],
    }),
  ],
});
