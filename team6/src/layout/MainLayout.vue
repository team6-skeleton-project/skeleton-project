<!-- Header.vue와 BottomNav.vue를 합친 하나의 컴포넌트로 완성 -->
<template>
  <div class="layout-container">
    <Header></Header>
    <main class="content">
      <router-view></router-view>
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
  /* 🌟 핵심 1: 최대 너비를 스마트폰 크기로 제한하고 가운데로 보냅니다 */
  width: 100%;
  max-width: 480px;
  margin: 0 auto;

  /* 🌟 핵심 2: 브라우저 끝까지 닿도록 높이 설정 */
  min-height: 100vh;
  position: relative;

  /* (선택) PC에서 볼 때 진짜 스마트폰 화면처럼 보이도록 양옆에 그림자 넣기 */
  background-color: #f5f5f5; /* 앱 기본 배경색 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  /* 부모를 벗어나는 요소 잘라내기 (가로 스크롤 방지) */
  overflow-x: hidden;
}
.content {
  /* 상단바와 하단바 사이의 공간을 꽉 채움 */
  flex: 1;
  /* 하단 바 높이만큼 여백 확보 */
  padding-bottom: 60px;
}
</style>
