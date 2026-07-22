import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
      customCss: ['./src/styles/atlas.css'],
      sidebar: [
        {
          label: 'Ruta de aprendizaje',
          translations: { en: 'Learning route' },
          items: [
            { label: 'Inicio', translations: { en: 'Start here' }, link: '/' },
            {
              label: '01 · Fundamentos',
              translations: { en: '01 · Foundations' },
              items: [
                { label: 'Panorama', translations: { en: 'Overview' }, link: '/foundations/' },
                { label: 'Linux y terminal', translations: { en: 'Linux and terminal' }, link: '/foundations/linux-cli/' },
                { label: 'Redes esenciales', translations: { en: 'Essential networking' }, link: '/foundations/networking/' },
                { label: 'Lab · shell y red', translations: { en: 'Lab · shell and network' }, link: '/foundations/lab-shell-and-network/' },
              ],
            },
            {
              label: '02 · Colaboración',
              translations: { en: '02 · Collaboration' },
              items: [
                { label: 'Panorama', translations: { en: 'Overview' }, link: '/collaboration/' },
                { label: 'El modelo de Git', translations: { en: 'The Git model' }, link: '/collaboration/git-model/' },
                { label: 'GitHub Flow', link: '/collaboration/github-flow/' },
                { label: 'Lab · ramas seguras', translations: { en: 'Lab · safe branches' }, link: '/collaboration/lab-git-branching/' },
              ],
            },
            {
              label: '03 · Entrega',
              translations: { en: '03 · Delivery' },
              items: [
                { label: 'Panorama', translations: { en: 'Overview' }, link: '/delivery/' },
                { label: 'Docker sin magia', translations: { en: 'Docker without magic' }, link: '/delivery/docker/' },
                { label: 'GitHub Actions', link: '/delivery/github-actions/' },
                { label: 'Lab · pipeline local', translations: { en: 'Lab · local pipeline' }, link: '/delivery/lab-container-pipeline/' },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
