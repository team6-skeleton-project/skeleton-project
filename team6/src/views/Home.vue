<template>
  <div class="home-container">
    <div class="fixed-header">
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
    </div>

    <div class="content-body">
      <div v-if="viewMode === 'calendar'" class="calendar-view">
        <div class="weekdays">
          <div
            v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
            :key="day"
            class="weekday"
            :class="{ sunday: day === '일', saturday: day === '토' }"
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
          <div
            v-for="day in calendarDays"
            :key="day.date"
            class="day-cell"
            @click="showDailyDetail(day)"
          >
            <span class="date-num" :class="{ today: isToday(day.fullDate) }">
              {{ day.date }}
            </span>
            <div class="day-amounts">
              <span v-if="day.incomeSum > 0" class="amt income">
                {{ day.incomeSum.toLocaleString() }}
              </span>
              <span v-if="day.expenseSum > 0" class="amt expense">
                {{ day.expenseSum.toLocaleString() }}
              </span>
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

    <div
      v-if="isDetailOpen"
      class="bottom-sheet-overlay"
      @click.self="isDetailOpen = false"
    >
      <div class="bottom-sheet">
        <div class="handle"></div>
        <div class="sheet-header">
          <h3>{{ clickedDateText }} 내역</h3>
          <button class="close-btn" @click="isDetailOpen = false">닫기</button>
        </div>
        <div class="sheet-content">
          <div v-if="selectedDatelist.length === 0" class="empty-msg">
            내역이 없습니다.
          </div>
          <TransactionItem
            v-for="item in selectedDatelist"
            :key="item.id"
            v-bind="item"
            @click="openEditModal(item)"
          />
        </div>
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

import MonthSelector from '@/components/home/MonthSelector.vue';
import SummaryBar from '@/components/home/SummaryBar.vue';
import TransactionItem from '@/components/home/TransactionItem.vue';
import EditModal from './Edit.vue';

const user = JSON.parse(localStorage.getItem('user'));

// --- 상태 관리 ---
const viewMode = ref('calendar');
const selectedDate = ref(new Date());

const list = ref([]);
const isEditModalOpen = ref(false);
const selectedRecord = ref(null);

// --- 바텀 시트 상태 ---
const isDetailOpen = ref(false);
const clickedDateText = ref('');
const selectedDatelist = computed(() => {
  return list.value.filter((r) => r.date === clickedDateText.value);
});

// --- 데이터 통신 ---
const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/records');
    list.value = response.data;
  } catch (error) {
    console.error('데이터 통신 실패:', error);
  }
};

onMounted(() => {
  fetchData();
});

const showDailyDetail = (day) => {
  clickedDateText.value = day.fullDate;
  // 전체 데이터 중 해당 날짜 데이터만 필터링
  isDetailOpen.value = true;
};

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
        item.userId === user.id &&
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

    const dailylist = list.value.filter((r) => r.date === dateStr);

    const incomeSum = dailylist
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);

    const expenseSum = dailylist
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    days.push({
      date: i,
      fullDate: dateStr,
      incomeSum,
      expenseSum,
    });
  }
  return days;
});

const isToday = (dateString) =>
  dateString === new Date().toISOString().split('T')[0];

const openEditModal = (item) => {
  selectedRecord.value = item;
  isEditModalOpen.value = true;
};

const handleModalClose = async () => {
  isEditModalOpen.value = false;

  await fetchData();
};
</script>

<style scoped>
/* 기존 스타일 유지 (생략) */
.home-container {
  width: 100%;
  height: calc(100vh - 56px - 80px);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
}

.fixed-header {
  flex-shrink: 0;
  background-color: #fff;
  z-index: 10;
  border-bottom: 1px solid #f5f5f5;
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
  z-index: 11;
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

.content-body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
}
.content-body::-webkit-scrollbar {
  display: none;
}

.calendar-view {
  padding: 20px 5px;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  color: #bbb;
  margin-bottom: 15px;
}
.weekday.sunday {
  color: #ec407a;
}
.weekday.saturday {
  color: #54a0ff;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;
  column-gap: 2px;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 95px;
  padding-top: 8px;
  border-top: 1px solid #f9f9f9;
  cursor: pointer;
}
.day-cell:active {
  background-color: #f5f5f5;
}

.date-num {
  font-size: 14px;
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-bottom: 8px;
}
.date-num.today {
  background-color: #ffc107;
  color: #fff;
  font-weight: bold;
}

.day-amounts {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 4px;
  gap: 2px;
  box-sizing: border-box;
}
.amt {
  font-size: 10px;
  font-weight: 600;
  text-align: right;
  display: block;
  white-space: nowrap;
}
.amt.income {
  color: #6c8fc7;
}
.amt.expense {
  color: #ef5350;
}

/* 바텀 시트 스타일 */
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}
.bottom-sheet {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 12px 20px 30px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}
.handle {
  width: 40px;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin: 0 auto 15px;
}
.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.sheet-header h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
}
.close-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;
}

.sheet-content {
  overflow-y: auto;
  flex: 1;
}
.empty-msg {
  text-align: center;
  padding: 40px 0;
  color: #ccc;
  font-size: 14px;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.list-wrapper {
  padding: 10px 0;
}
.empty-state {
  text-align: center;
  padding: 100px 0;
  color: #ccc;
}
</style>
