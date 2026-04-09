<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <MonthSelector @changeMonth="handleMonthChange" />
        <SummaryBar :list="filteredList" />
      </div>

      <div class="list-wrapper">
        <TransactionItem
          v-for="(item, i) in filteredList"
          :key="item.id"
          v-bind="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SummaryBar from '@/components/home/SummaryBar.vue';
import { ref, computed } from 'vue';
import TransactionItem from '@/components/home/TransactionItem.vue';
import foodIcon from '@/images/category-food.svg';
import MonthSelector from '@/components/home/MonthSelector.vue';

/* 🔥 선택된 날짜 */
const selectedDate = ref(new Date());

/* TODO: 더미 데이터 -> db 데이터로 바꾸기 */
const list = [
  {
    id: '1001',
    title: '돈까스',
    date: '2026-04-07',
    type: 'expense',
    category: '식비',
    amount: 12000,
    memo: '점심 돈까스',
  },
  {
    id: '1002',
    title: '돈까스',
    date: '2026-04-06',
    type: 'expense',
    category: '교통/차량',
    amount: 5000,
    memo: '택시',
  },
  {
    id: '1003',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1004',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1005',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1006',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1007',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1008',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1009',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1010',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1011',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1012',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1013',
    title: '돈까스',
    date: '2026-03-05',
    type: 'income',
    category: '월급',
    amount: 2000000,
    memo: '월급 입금',
  },
  {
    id: '1004',
    title: '돈까스',
    date: '2026-04-06',
    type: 'expense',
    category: '패션/미용',
    amount: 50000,
    memo: '옷구매',
  },
];

/* 🔥 월 필터링 */
const filteredList = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;

  return list.filter((item) => {
    const d = new Date(item.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
});

/* 🔥 MonthSelector에서 받은 값 */
const handleMonthChange = (date) => {
  selectedDate.value = date;
};
</script>

<style scoped>
.container {
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  overflow: hidden;
}

.content {
  padding-bottom: 100px; /* 하단바 + 여유 */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top {
  padding: 20px 0;
}

.list-wrapper {
  flex: 1;
  overflow-y: auto;
}
</style>
