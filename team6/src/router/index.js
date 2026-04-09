import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layout/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 1. 상단 바(Header)와 하단 바(BottomNav)가 포함되는 페이지들
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '', // 홈 화면 (달력)
          name: 'home',
          component: () => import('../views/Home.vue'),
        },
        {
          path: 'chart', // 통계 화면
          name: 'chart',
          component: () => import('../views/Chart.vue'),
        },
        {
          path: 'add', // 추가 화면
          name: 'add',
          component: () => import('../views/Add.vue'),
        },
        {
          path: 'edit/:id', // 수정 화면
          name: 'edit-id',
          component: () => import('../views/Edit.vue'),
        },
        {
          // 🌟 마이페이지를 MainLayout의 자식으로 등록
          // 부모 path가 '/'이므로 'mypage'만 적으면 주소는 '/mypage'가 됩니다.
          path: 'mypage',
          name: 'mypage',
          component: () => import('../views/MyPage.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      // 2. 레이아웃 없이 단독으로 나오는 페이지들
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue'),
    },
  ],
});

// 네비게이션 가드: 로그인 여부 체크
router.beforeEach((to) => {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  // 로그인이 필요한 페이지인데 로그인이 안 된 경우
  if (to.meta.requiresAuth && !user) {
    alert('로그인이 필요합니다.');
    return '/login';
  }

  // 이미 로그인했는데 로그인/회원가입 페이지로 가려는 경우
  if ((to.path === '/login' || to.path === '/signup') && user) {
    return '/';
  }
});

export default router;
