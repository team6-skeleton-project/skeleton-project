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
    },
  ],
});

export default router;
