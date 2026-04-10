<template>
  <div class="item">
    <div class="left">
      <div class="icon">
        <img :src="iconPath" alt="icon" />
      </div>

      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="category">{{ category }}</div>
      </div>
    </div>

    <div class="amount" :class="type">
      {{ displayAmount }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  category: String,
  amount: Number,
  type: String,
  iconPath: String, // 부모가 짝지어서 보내준 이미지 경로
});

/**
 * 금액 포맷팅 (콤마 및 기호)
 */
const displayAmount = computed(() => {
  if (!props.amount) return '0원';
  const price = props.amount.toLocaleString();
  return props.type === 'expense' ? `- ${price}원` : `${price}원`;
});
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
.left {
  display: flex;
  align-items: center;
  flex: 1;
}
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
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.info {
  margin-left: 14px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.category {
  font-size: 13px;
  color: #b0b0b0;
  margin-top: 4px;
}
.amount {
  font-size: 16px;
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}
.amount.income {
  color: #4a90e2;
}
.amount.expense {
  color: #e74c3c;
}
</style>
