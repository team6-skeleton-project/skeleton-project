<template>
  <div class="month-selector">
    <button class="nav-btn" @click="prevMonth">&lt;</button>

    <div class="month-display">
      {{ currentMonthText }}
    </div>

    <button class="nav-btn" @click="nextMonth">&gt;</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['changeMonth']);

/* 기준 날짜 (오늘) */
const currentDate = ref(new Date());

/* 월 텍스트: Chart.vue와 맞게 연도까지 포함하면 더 깔끔합니다 */
const currentMonthText = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  return `${year}년 ${month}월`;
});

/* 공통 업데이트 함수 */
const update = (date) => {
  currentDate.value = date;
  emit('changeMonth', date);
};

/* 이전 달 */
const prevMonth = () => {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  update(d);
};

/* 다음 달 */
const nextMonth = () => {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  update(d);
};
</script>

<style scoped>
.month-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px; /* 버튼과 텍스트 사이 간격 */
  padding: 20px 0;
}

/* 🌟 Chart.vue에서 가져온 핵심 화살표 스타일 */
.nav-btn {
  background: none;
  border: 1px solid #eee; /* 연한 테두리 */
  padding: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #ffc107; /* 노란색 포인트 컬러 */
  font-weight: bold;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:active {
  background-color: #fff9e6;
  transform: scale(0.95);
}

/* 중앙 연도/월 표시 스타일 */
.month-display {
  font-size: 30px; /* Chart.vue의 h2 크기와 맞춤 */
  font-weight: 700;
  color: #333;
  min-width: 120px; /* 글자 길이에 따른 흔들림 방지 */
  text-align: center;
}
</style>
