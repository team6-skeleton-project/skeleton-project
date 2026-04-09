import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layout/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 상단 바와 하단 바가 있는 기본 레이아웃 적용
      path: '/',
      component: MainLayout, // Header랑 BottomNav를 합친 MainLayout을 만들어서 적용
      children: [
        // 하나의 컴포넌트만 가능하기 때문에 이렇게 수행.
        // 기본 레이아웃이 적용될 컴포넌트들
        {
          path: '', // 홈 화면 (달력)
          name: 'Home',
          component: () => import('../views/Home.vue'),
        },
        {
          path: 'chart', // 통계 화면 (그래프)
          name: 'chart',
          component: () => import('../views/Chart.vue'),
        },
        {
          path: 'add', // 지출 내역 추가 화면
          name: 'add',
          component: () => import('../views/Add.vue'),
        },
        {
          path: 'edit/:id', // 지출 내역 수정 화면
          name: 'editId',
          component: () => import('../views/Edit.vue'),
        },
      ],
    },
    {
      //메인 레이아웃 적용하지 않은
      path: '/login', //로그인 화면
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/signup', //회원가입 화면
      name: 'signup',
      component: () => import('../views/Signup.vue'),
    },
    {
      path: '/myPage', //마이페이지 화면
      name: 'myPage',
      component: () => import('../views/MyPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// 네비게이션 가드 (로그인 체크)
router.beforeEach((to) => {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  // 1. 로그인이 필요한 페이지인데 유저가 없는 경우
  if (to.meta.requiresAuth && !user) {
    alert('로그인이 필요합니다.');
    return '/login';
  }

  // 2. 이미 로그인했는데 다시 로그인/회원가입으로 가려는 경우
  if ((to.path === '/login' || to.path === '/signup') && user) {
    return '/';
  }
});

export default router;
