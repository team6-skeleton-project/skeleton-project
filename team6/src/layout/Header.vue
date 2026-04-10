<template>
  <header class="header">
    <div class="logo-area" @click="$router.push('/')">
      <img
        src="@/images/HeaderLogo.png"
        alt="Don Touch 로고"
        class="header-logo"
      />
    </div>

    <img
      src="@/images/MyPageicon.png"
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
  router.push('/mypage');
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 480px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  /* 로고 이미지 배경이 흰색일 경우를 대비해 배경색을 흰색으로 변경 추천 */
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 100;
}

.logo-area {
  display: flex;
  align-items: center;
  cursor: pointer; /* 클릭 가능한 느낌 제공 */
}

.header-logo {
  /* 🌟 헤더 높이(56px)에 맞춰 적절한 크기로 조절 */
  height: 40px;
  width: auto;
  object-fit: contain;
}

.MyPageicon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
