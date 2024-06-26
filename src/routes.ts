import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  // {
  //   path: '/game/:id',
  //   component: lazy(() => import('./pages/game')),
  // },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/rules',
    component: lazy(() => import('./pages/rules')),
  },
  {
    path: '/game',
    component: lazy(() => import('./pages/game')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
