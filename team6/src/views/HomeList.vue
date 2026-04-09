<template>
  <div class="container">
    <div class="content">
      <div class="list-wrapper">
        <TransactionItem
          v-for="(item, i) in list"
          :key="i"
          v-bind="item"
        />
        </div>
    </div>
  </div>
</template>

<script setup>
import TransactionItem from '@/components/home/TransactionItem.vue'
import foodIcon from '@/assets/category-food.svg'

/* TODO: 더미 데이터 -> db 데이터로 바꾸기 */
const list = [
{
    id: "1001",
    title: "돈까스",
    date: "2026-04-07",
    type: "expense",
    category: "식비",
    amount: 12000,
    memo: "점심 돈까스"
  },
  {
    id: "1002",
    title: "돈까스",
    date: "2026-04-06",
    type: "expense",
    category: "교통/차량",
    amount: 5000,
    memo: "택시"
  },
  {
    id: "1003",
    title: "돈까스",
    date: "2026-04-05",
    type: "income",
    category: "월급",
    amount: 2000000,
    memo: "월급 입금"
  },
  {
    id: "1004",
    title: "돈까스",
    date: "2026-04-06",
    type: "expense",
    category: "패션/미용",
    amount: 50000,
    memo: "옷구매"
  }
]
</script>

<style scoped>
.container {
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  overflow: hidden;
}

.content {
  padding-top: 350px;   /* 상단바 높이 */
  padding-bottom: 100px; /* 하단바 + 여유 */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-wrapper {
  flex: 1;
  overflow-y: auto;
}
</style>