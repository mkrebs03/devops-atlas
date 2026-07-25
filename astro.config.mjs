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
      },
      sidebar: [
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
