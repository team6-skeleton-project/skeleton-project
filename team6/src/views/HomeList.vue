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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SummaryBar from '@/components/home/SummaryBar.vue';
import TransactionItem from '@/components/home/TransactionItem.vue';
// import foodIcon from '@/images/category-food.svg';
import MonthSelector from '@/components/home/MonthSelector.vue';

/* 🔥 선택된 날짜 */
const selectedDate = ref(new Date());
const list = ref([]);

/* 🔥 서버에서 데이터 가져오기 */
const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/records');
    list.value = res.data;
  } catch (e) {
    console.error('데이터 가져오기 오류 : ', e);
  }
};

/* 🔥 컴포넌트 실행될 때 호출 */
onMounted(() => {
  fetchData();
});

/* 🔥 월 필터링 */
const filteredList = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;

  return list.value.filter((item) => {
    const d = new Date(item.date);
    return (
      item.userId === 'u001' && // TODO: 사용자 하드코딩 수정 필요
      d.getFullYear() === year &&
      d.getMonth() + 1 === month
    );
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
