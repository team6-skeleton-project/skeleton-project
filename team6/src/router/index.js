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

// ... 상단 import 부분은 동일 ...

//  네비게이션 가드 최신 수정본
router.beforeEach((to, from) => {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  // 1. 로그인이 필요한 페이지인데 로그인이 안 된 경우
  if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
    // 처음 접속하거나 주소창 직접 입력이 아닐 때만 알림
    if (from.path !== '/' && from.name !== null) {
      alert('로그인이 필요합니다.');
    }

    // ✅ next('/login') 대신 경로를 바로 return 합니다.
    return { name: 'login' };
  }

  // 2. 로그인 상태인데 로그인/회원가입으로 가려는 경우
  if ((to.path === '/login' || to.path === '/signup') && user) {
    // ✅ '/' 경로로 리턴
    return { name: 'home' };
  }

  // 3. 그 외에는 아무것도 리턴하지 않거나 true를 리턴하여 통과시킵니다.
  return true;
});

export default router;
