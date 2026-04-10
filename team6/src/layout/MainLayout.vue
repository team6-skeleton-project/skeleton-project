<template>
  <div class="layout-container">
    <Header></Header>

    <main class="content">
      <router-view :key="$route.fullPath"></router-view>
    </main>

    <BottomNav @open-add="isAddModalOpen = true"></BottomNav>

    <AddModal v-if="isAddModalOpen" @close="isAddModalOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './Header.vue';
import BottomNav from './BottomNav.vue';
// 🌟 Add.vue를 불러옵니다 (경로는 실제 위치에 맞게 수정하세요)
import AddModal from '@/views/Add.vue';

// 🌟 모달 표시 여부 상태 변수
const isAddModalOpen = ref(false);
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.layout-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative; /* 모달 배치를 위해 추가 */
}

.content {
  flex: 1;
  padding-top: 64px;
  padding-bottom: 60px;
}
</style>
