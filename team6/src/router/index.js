import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MyPage from '@/views/MyPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
    },
  ],
});

export default router;
