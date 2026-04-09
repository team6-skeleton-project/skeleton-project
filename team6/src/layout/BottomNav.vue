<template>
  <div class="bottom-nav">
    <div class="nav-item">
      <img
        src="@/assets/bottom_icon_home.png"
        alt="home"
        class="Home"
        @click="goToHome"
      />
    </div>

    <div class="fab">+</div>

    <div class="nav-item">
      <img
        src="@/assets/bottom_icon_graph.png"
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
  padding: 0 40px;
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
  width: 31px;
  height: 31px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
