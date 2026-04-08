<template>
  <header class="header">
    <h1 class="title">가계부</h1>

    <img
      src="@/assets/MyPageicon.png"
      alt="사용자"
      class="MyPageicon"
      @click="goToMyPage"
    />
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToMyPage() {
  router.push({ name: 'myPage' });
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 390px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  background: #f5f5f5;
  border-bottom: 1px solid #eee;
  z-index: 1000;
}

.title {
  font-weight: 700;
  font-size: 18px;
}

.MyPageicon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
