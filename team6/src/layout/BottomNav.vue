<template>
  <div class="bottom-nav">
    <div class="nav-item">
      <img
        src="@/images/bottom_icon_home.png"
        alt="home"
        class="Home"
        @click="goToHome"
      />
    </div>

    <div class="fab">+</div>

    <div class="nav-item">
      <img
        src="@/images/bottom_icon_graph.png"
        alt="통계"
        class="Chart"
        @click="goToChart"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
  router.push({ name: 'Home' });
}

function goToChart() {
  router.push({ name: 'chart' });
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  height: 80px;
  background: #ffc107;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 양옆 패딩을 40px에서 80px~100px 정도로 늘려보세요 */
  padding: 0 80px;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

/* 좌우 아이콘 */
.nav-item {
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.nav-item.active img {
  filter: brightness(0) invert(1); /* 흰색 강조 느낌 */
  transform: scale(1.2);
}

/* 가운데 + 버튼 */
.fab {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -30px;
  width: 72px;
  height: 72px;
  background: #fff;
  color: #ffc107;
  border-radius: 50%;

  /* 정렬 핵심 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* 폰트 설정 */
  font-size: 45px;
  font-weight: bold;

  /* 중요: 중앙 정렬 보정 */
  line-height: 0; /* 텍스트 박스의 기본 높이를 제거 */
  padding-top: 6px; /* 폰트 특성상 위로 쏠린 기호를 아래로 미세하게 밀어줌 */

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
