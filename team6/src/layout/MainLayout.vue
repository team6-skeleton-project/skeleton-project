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
import { useRoute } from 'vue-router'; // route 정보를 쓰기 위해 추가
import Header from './Header.vue';
import BottomNav from './BottomNav.vue';

const route = useRoute();
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.layout-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background-color: #f5f5f5;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  display: flex; /* 추가: flex 구조로 변경 */
  flex-direction: column; /* 추가: 세로 방향 정렬 */
}

.content {
  flex: 1;
  /* 상단 Header가 fixed라면 그만큼 여백이 필요할 수 있습니다 */
  padding-top: 56px; /* Header 높이만큼 추가 */
  padding-bottom: 60px; /* BottomNav 높이만큼 유지 */
}
</style>
