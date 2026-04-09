<template>
  <div class="summary-bar">

    <div class="row">
      <span class="label expense">지출</span>
      <span class="amount">{{ expenseTotal.toLocaleString() }}</span>
    </div>

    <div class="row">
      <span class="label income">수입</span>
      <span class="amount">{{ incomeTotal.toLocaleString() }}</span>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  list: Array
})

const expenseTotal = computed(() => {
  return props.list
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
})

const incomeTotal = computed(() => {
  return props.list
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
})
</script>

<style scoped>
.summary-bar {
  background: #d0d0d03d;
  border-radius: 16px;
  padding: 16px 20px;
  margin: 10px 20px;

}

/* 한 줄 */
.row {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 아래 줄 간격 */
.row + .row {
  margin-top: 10px;
}

/* 지출/수입 텍스트 */
.label {
  font-size: 22px;
  font-weight: 700;
}

.label.expense {
  color: #d97a7a;
}

.label.income {
  color: #6c8fc7;
}

/* 금액 */
.amount {
  font-size: 28px;
  font-weight: 700;
}
</style>