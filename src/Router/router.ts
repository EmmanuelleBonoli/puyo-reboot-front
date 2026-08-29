import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import GamePage from '../Game/pages/GamePage.vue';
import SplashPage from '../Game/pages/SplashPage.vue';
import LoadingPage from '../Game/pages/LoadingPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/splash',
    name: 'SplashPage',
    component: SplashPage,
  },
  {
    path: '/',
    name: 'LoadingPage',
    component: LoadingPage,
  },
  {
    path: '/game',
    name: 'GamePage',
    component: GamePage,
  },
  {
    path: '/home',
    name: 'HomePage',
    component: () => import('../Game/pages/HomePage.vue'),
  },
  {
    path: '/store',
    name: 'StorePage',
    component: () => import('../Game/pages/StorePage.vue'),
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: () => import('../Game/pages/SettingsPage.vue'),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
