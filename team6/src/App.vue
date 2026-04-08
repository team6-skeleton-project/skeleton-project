<template>
  <div class="wrapper">
    <div class="app">
      <Header />
      <main class="content">
        <router-view />
      </main>
      <BottomNav />
    </div>
  </div>
</template>

<script setup>
import Header from './layout/Header.vue';
import BottomNav from './layout/BottomNav.vue';
</script>

<style>
/* 브라우저 전체에서 앱 화면만 중앙 */
.wrapper {
  display: flex;
  justify-content: center; /* 좌우 가운데 */
  min-height: 100vh; /* 화면 전체 높이 */
  background: #ffffff; /* 페이지 배경 */
  padding: 20px 0; /* 위아래 여백 */
  box-sizing: border-box;
}

/* 앱 화면 */
.app {
  width: 390px; /* 앱 기본 너비 */
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 콘텐츠 영역 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 56px 16px; /* 상단 56px(Header 높이), 좌우 16px, 하단 16px */
  box-sizing: border-box;
}
</style>
