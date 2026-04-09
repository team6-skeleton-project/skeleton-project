<template>
  <div class="month-selector">

    <!-- 이전 -->
    <button @click="prevMonth">&lt;</button>

    <!-- 현재 월 -->
    <div class="month">
      {{ currentMonthText }}
    </div>

    <!-- 다음 -->
    <button @click="nextMonth">&gt;</button>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* 부모로 보낼 이벤트 */
const emit = defineEmits(['changeMonth'])

/* 🔥 기준 날짜 (오늘) */
const currentDate = ref(new Date())

/* 🔥 월 텍스트 */
const currentMonthText = computed(() => {
  return `${currentDate.value.getMonth() + 1}월`
})

/* 🔥 공통 업데이트 함수 */
const update = (date) => {
  currentDate.value = date
  emit('changeMonth', date)
}

/* 🔥 이전 달 */
const prevMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  update(d)
}

/* 🔥 다음 달 */
const nextMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  update(d)
}
</script>

<style scoped>
.month-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  font-size: 28px;
  font-weight: bold;

  padding: 20px 0;
}

button {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
}

.month {
  min-width: 80px;
  text-align: center;
}
</style>