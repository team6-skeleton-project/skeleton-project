import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layout/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      // 🌟 [중요] 부모에 meta를 넣으면 모든 자식(Home, Chart, MyPage 등)에게 자동 적용됩니다!
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue'),
        },
        {
          path: 'chart',
          name: 'chart',
          component: () => import('../views/Chart.vue'),
        },
        {
          path: 'add',
          name: 'add',
          component: () => import('../views/Add.vue'),
        },
        {
          path: 'edit/:id',
          name: 'edit-id',
          component: () => import('../views/Edit.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue'),
    },
    {
      // ✅ 마이페이지를 독립적인 경로로 이동
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/MyPage.vue'),
      meta: { requiresAuth: true }, // 로그인은 여전히 필요함
    },
  ],
});

// 🌟 네비게이션 가드 수정본
router.beforeEach((to, from, next) => {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  // 1. 로그인이 필요한 페이지인데 로그인이 안 된 경우
  if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
    // 💡 [수정 포인트]
    // 처음 접속(from.path === '/')하거나, 주소창에 직접 쳐서 들어올 때는
    // 알림창 없이 조용히 로그인 화면으로 리다이렉트 합니다.
    if (from.path !== '/' && from.name !== null) {
      alert('로그인이 필요합니다.');
    }

    next('/login');
  }
  // 2. 로그인 상태인데 로그인/회원가입으로 가려는 경우
  else if ((to.path === '/login' || to.path === '/signup') && user) {
    next('/');
  }
  // 3. 그 외엔 통과
  else {
    next();
  }
});

export default router;
