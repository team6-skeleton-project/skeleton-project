<template>
  <div class="chart-box">
    <Doughnut :data="chartData" :options="pieOptions" />
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs';

defineProps({
  chartData: { type: Object, required: true },
});

// Chart.js 기본 애니메이션 설정을 유지하는 옵션
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<style scoped>
.chart-box {
  position: relative;
  width: 100%;
  height: 240px;
}
</style>
