<template>
  <div class="item">

    <!-- 왼쪽 묶기 -->
    <div class="left">
      <div class="icon">
        <img :src="icon" />
      </div>

      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="category">{{ category }}</div>
      </div>
    </div>

    <!-- 오른쪽 (금액) -->
    <div class="amount" :class="type">
      {{ displayAmount }}
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  category: String,
  amount: Number,
  type: String,
  icon: String
})

const displayAmount = computed(() => {
  if (!props.amount) return '0원'
  
  const price = props.amount.toLocaleString()
  
  return props.type === 'expense'
    ? `- ${price}원`
    : `${price}원`
})
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}

/* 왼쪽 묶기 */
.left {
  display: flex;
  align-items: center;
  flex: 1;
}

/* 아이콘 */
.icon {
  width: 44px;
  height: 44px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

/* 텍스트 */
.info {
  margin-left: 14px;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.category {
  font-size: 13px;
  color: #b0b0b0;
  margin-top: 4px;
}

/* 금액 */
.amount {
  font-size: 16px;
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

/* 색상 */
.amount.income {
  color: #4A90E2;
}

.amount.expense {
  color: #E74C3C;
}
</style>