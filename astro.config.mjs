import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { learningModules } from './src/data/learning-path.mjs';

const learningSidebar = learningModules.map((module) => ({
  label: module.sidebarLabel.es,
  translations: { en: module.sidebarLabel.en },
  items: module.steps.map((step) => ({
    label: step.label.es,
    translations: { en: step.label.en },
    link: `/${step.relativePath}`,
  })),
}));

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  integrations: [
    starlight({
      title: 'DevOps Atlas',
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
        './src/styles/learning-path.css',
        './src/styles/lesson.css',
        './src/styles/progress.css',
      ],
      components: {
        Header: './src/components/starlight/AtlasHeader.astro',
        PageTitle: './src/components/starlight/AtlasPageTitle.astro',
        Footer: './src/components/starlight/AtlasFooter.astro',
      },
      sidebar: [
        {
          label: 'Ruta de aprendizaje',
          translations: { en: 'Learning route' },
          items: [
            { label: 'Inicio', translations: { en: 'Start here' }, link: '/' },
            ...learningSidebar,
          ],
        },
      ],
    }),
  ],
});
