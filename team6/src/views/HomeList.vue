<template>
  <div class="container">

    <div class="content">
      <TransactionItem
        v-for="(item, i) in list"
        :key="i"
        v-bind="item"
      />
    </div>

  </div>
</template>

<script setup>
import TransactionItem from '@/components/TransactionItem.vue'
import foodIcon from '@/assets/category-food.svg'

/* TODO: 더미 데이터 -> db 데이터로 바꾸기 */
const list = [
  {
    title: '시홍쓰',
    category: '식비',
    amount: 13000,
    type: 'expense',
    icon: foodIcon
  },
  {
    title: 'Spotify',
    category: 'Music',
    amount: 12990,
    type: 'expense',
    icon: foodIcon
  },
  {
    title: '월급',
    category: '급여',
    amount: 500000,
    type: 'income',
    icon: foodIcon
  }
]
</script>

<style scoped>
.container {
  max-width: 390px;
  margin: 0 auto;
}

.content {
  padding-top: 80px;   /* 상단바 높이 */
  padding-bottom: 100px; /* 하단바 + 여유 */
}
</style>