import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'editor/:env/:service/:tenant',
    renderMode: RenderMode.Server, // or RenderMode.Client
  }
];
