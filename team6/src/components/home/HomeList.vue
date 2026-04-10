<template>
  <div class="list-wrapper">
    <div v-if="filteredList.length === 0" class="empty-state">
      내역이 없습니다.
    </div>
    <div v-else>
      <div v-for="date in sortedDates" :key="date" class="date-group">
        <div class="date-header">
          <span class="date-text">{{ formatDate(date) }}</span>
          <span class="daily-total"
            >{{ getDailyTotal(groupedList[date]).toLocaleString() }}원</span
          >
        </div>
        <TransactionItem
          v-for="item in groupedList[date]"
          :key="item.id"
          v-bind="item"
          @click="$emit('openEdit', item)"
        />
        <div class="group-divider"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TransactionItem from '@/components/home/TransactionItem.vue';

const props = defineProps({ filteredList: Array });
defineEmits(['openEdit']);

// 날짜별 그룹화 로직
const groupedList = computed(() => {
  const groups = {};
  props.filteredList.forEach((item) => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });
  return groups;
});

const sortedDates = computed(() =>
  Object.keys(groupedList.value).sort((a, b) => new Date(b) - new Date(a)),
);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getDate()}일 ${week[d.getDay()]}요일`;
};

const getDailyTotal = (items) =>
  items.reduce(
    (sum, item) =>
      item.type === 'expense' ? sum - item.amount : sum + item.amount,
    0,
  );
</script>

<style scoped>
.date-header {
  padding: 18px 16px 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.date-text {
  font-size: 14px;
  color: #888;
}
.daily-total {
  font-size: 18px;
  font-weight: 700;
  color: #111;
}
.group-divider {
  height: 6px;
  background: #f5f5f5;
  margin-top: 10px;
}
.empty-state {
  text-align: center;
  padding: 100px 0;
  color: #ccc;
}
</style>
