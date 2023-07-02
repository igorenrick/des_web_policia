import { createRouter, createWebHistory } from 'vue-router';
import PatrolApp from '../components/PatrolApp.vue';

const routes = [
  {
    path: '/chat',
    name: 'PatrolApp',
    component: PatrolApp
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
