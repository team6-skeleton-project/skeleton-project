<template>
  <div class="chart-box">
    <Bar :data="chartData" :options="barOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';

const props = defineProps({
  chartData: { type: Object, required: true },
});

const emit = defineEmits(['onBarClick']);

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      // 부모에게 클릭된 데이터의 라벨(월)을 전달
      emit('onBarClick', props.chartData.labels[index]);
    }
  },
};
</script>

<style scoped>
.chart-box {
  position: relative;
  width: 100%;
  height: 260px;
}
</style>
