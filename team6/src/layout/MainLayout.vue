<template>
  <div class="layout-container">
    <Header></Header>
    <main class="content">
      <router-view :key="$route.fullPath"></router-view>
    </main>
    <BottomNav></BottomNav>
  </div>
</template>

<script setup>
import Header from './Header.vue';
import BottomNav from './BottomNav.vue';
</script>

<style scoped>
.layout-container {
  width: 100%;
  max-width: 480px; /* 폰 규격 고정 */
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff; /* 배경을 흰색으로 하여 깔끔하게 변경 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  /* 🌟 헤더 로고가 커졌으므로 패딩을 60px~70px로 조절하세요 */
  padding-top: 64px;
  padding-bottom: 60px;
}
</style>
