import { createRouter, createWebHistory } from 'vue-router';
import LoadingPage from '../Game/pages/LoadingPage.vue';
import LoginPage from '../Authentication/pages/LoginPage.vue';
import GamePage from '../Game/pages/GamePage.vue';

const routes = [
  {
    path: '/',
    name: 'LoadingPage',
    component: LoadingPage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/game',
    name: 'GamePage',
    component: GamePage,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
