<template>
  <div class="home-container">
    <div class="header-section">
      <div class="view-toggle">
        <button
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          목록
        </button>
        <button
          :class="{ active: viewMode === 'calendar' }"
          @click="viewMode = 'calendar'"
        >
          달력
        </button>
      </div>
      <MonthSelector @changeMonth="handleMonthChange" />
    </div>

    <SummaryBar :list="filteredList" />

    <div class="content-body">
      <div v-if="viewMode === 'calendar'" class="calendar-view">
        <div class="weekdays">
          <div
            v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
            :key="day"
            class="weekday"
          >
            {{ day }}
          </div>
        </div>
        <div class="days-grid">
          <div
            v-for="empty in emptyDays"
            :key="'empty-' + empty"
            class="day-cell empty"
          ></div>
          <div v-for="day in calendarDays" :key="day.date" class="day-cell">
            <span class="date-num" :class="{ today: isToday(day.fullDate) }">{{
              day.date
            }}</span>
            <div class="dots">
              <span v-if="day.hasExpense" class="dot expense-dot"></span>
              <span v-if="day.hasIncome" class="dot income-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="list-wrapper">
        <div v-if="filteredList.length === 0" class="empty-state">
          내역이 없습니다.
        </div>
        <TransactionItem
          v-else
          v-for="item in filteredList"
          :key="item.id"
          v-bind="item"
          @click="openEditModal(item)"
        />
      </div>
    </div>

    <EditModal
      v-if="isEditModalOpen"
      :record="selectedRecord"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// 컴포넌트 임포트
import MonthSelector from '@/components/home/MonthSelector.vue';
import SummaryBar from '@/components/home/SummaryBar.vue';
import TransactionItem from '@/components/home/TransactionItem.vue';
import EditModal from './Edit.vue';

// --- 상태 관리 ---
const viewMode = ref('calendar');
const selectedDate = ref(new Date());
const list = ref([]); // 전체 레코드 저장

const isEditModalOpen = ref(false);
const selectedRecord = ref(null);

// --- 데이터 가져오기 ---
const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/records');
    list.value = res.data;
  } catch (e) {
    console.error('데이터 가져오기 오류:', e);
  }
};

onMounted(() => {
  fetchData();
});

// --- 월 변경 처리 ---
const handleMonthChange = (date) => {
  selectedDate.value = date;
};

// --- 필터링 로직 (목록과 달력 공통 사용) ---
const filteredList = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;

  return list.value
    .filter((item) => {
      const d = new Date(item.date);
      return (
        // item.userId === 'u001' && // 👈 만약 데이터가 안 뜨면 이 줄을 주석처리하거나 확인하세요!
        d.getFullYear() === year && d.getMonth() + 1 === month
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// --- 달력 계산 로직 ---
const emptyDays = computed(() => {
  return new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    1,
  ).getDay();
});

const calendarDays = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 1; i <= lastDate; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dailyRecords = filteredList.value.filter((r) => r.date === dateStr);
    days.push({
      date: i,
      fullDate: dateStr,
      hasExpense: dailyRecords.some((r) => r.type === 'expense'),
      hasIncome: dailyRecords.some((r) => r.type === 'income'),
    });
  }
  return days;
});

const isToday = (dateString) =>
  dateString === new Date().toISOString().split('T')[0];

// --- 모달 제어 ---
const openEditModal = (item) => {
  selectedRecord.value = item;
  isEditModalOpen.value = true;
};

const handleModalClose = () => {
  isEditModalOpen.value = false;
  fetchData(); // 데이터 새로고침
};
</script>

<style scoped>
/* 기존 스타일 유지 (생략) */
.home-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
}
.header-section {
  position: relative;
  padding-top: 20px;
}
.view-toggle {
  position: absolute;
  left: 20px;
  top: 35px;
  display: flex;
  background-color: #f0ece1;
  border-radius: 20px;
  overflow: hidden;
  z-index: 10;
}
.view-toggle button {
  padding: 5px 12px;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
}
.view-toggle button.active {
  background-color: #e6dfcf;
  color: #333;
}
.calendar-view {
  padding: 20px;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 15px;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 20px;
}
.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 45px;
}
.date-num {
  font-size: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.date-num.today {
  background-color: #333;
  color: white;
  font-weight: bold;
}
.dots {
  display: flex;
  gap: 3px;
  margin-top: 4px;
}
.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.expense-dot {
  background-color: #ec407a;
}
.income-dot {
  background-color: #26a69a;
}
.list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
}
.empty-state {
  text-align: center;
  padding: 50px;
  color: #ccc;
}
</style>
