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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  /* 상단바와 하단바 사이의 공간을 꽉 채움 */
  flex: 1;
  /* 하단 바 높이만큼 여백 확보 */
  padding-bottom: 60px;
}
</style>
