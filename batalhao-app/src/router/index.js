import { createRouter, createWebHistory } from 'vue-router';
import BattalionChat from '../components/BattalionChat.vue';
import BattalionMap from '../components/BattalionMap.vue';

const routes = [
  {
    path: '/map',
    name: 'BattalionMap',
    component: BattalionMap
  },
  {
    path: '/chat/:patrolCarId',
    name: 'BattalionChat',
    component: BattalionChat,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
