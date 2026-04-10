<template>
  <div class="home-container">
    <div class="fixed-header">
      <div class="month-header">
        <MonthSelector @changeMonth="handleMonthChange" />
      </div>
      <SummaryBar :list="filteredList" />
      <div class="toggle-section">
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
      </div>
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
            <span class="date-num" :class="{ today: isToday(day.fullDate) }">{{
              day.date
            }}</span>
            <div class="day-amounts">
              <span v-if="day.incomeSum > 0" class="amt income">{{
                day.incomeSum.toLocaleString()
              }}</span>
              <span v-if="day.expenseSum > 0" class="amt expense">{{
                day.expenseSum.toLocaleString()
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <HomeList v-else :filteredList="filteredList" @openEdit="openEditModal" />
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
import HomeList from '../components/home/HomeList.vue';
import EditModal from './Edit.vue';

const user = JSON.parse(localStorage.getItem('user'));
const viewMode = ref('calendar');
const selectedDate = ref(new Date());
const list = ref([]);
const categories = ref([]);
const isEditModalOpen = ref(false);
const selectedRecord = ref(null);
const isDetailOpen = ref(false);
const clickedDateText = ref('');

// 데이터 호출 및 카테고리 정보 통합
const fetchData = async () => {
  try {
    const [recRes, incRes, expRes] = await Promise.all([
      axios.get('http://localhost:3000/records'),
      axios.get('http://localhost:3000/incomeCategory'),
      axios.get('http://localhost:3000/expenseCategory'),
    ]);
    categories.value = [...incRes.data, ...expRes.data];
    list.value = recRes.data;
  } catch (error) {
    console.error('Data loading failed:', error);
  }
};

onMounted(fetchData);
/**
 * 핵심 로직: 필터링된 리스트에 DB 아이콘 경로를 실시간 매칭
 */
const filteredList = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;
  return list.value
    .filter((item) => {
      const d = new Date(item.date);
      return (
        item.userId === user.id &&
        d.getFullYear() === year &&
        d.getMonth() + 1 === month
      );
    })
    .map((item) => {
      const categoryInfo = categories.value.find(
        (c) => c.name === item.category,
      );
      return {
        ...item,
        iconPath: `/src/images/${categoryInfo ? categoryInfo.icon : '18.png'}`,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 날짜별 그룹
const groupedList = computed(() => {
  const result = {};

  filteredList.value.forEach((item) => {
    const key = item.date;
    if (!result[key]) result[key] = [];
    result[key].push(item);
  });

  return result;
});

// 날짜 정렬
const sortedDates = computed(() => {
  return Object.keys(groupedList.value).sort((a, b) => {
    return new Date(b) - new Date(a);
  });
});

// 날짜 포맷
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getDate()}일 ${week[d.getDay()]}요일`;
};

// 하루 합계
const getDailyTotal = (items) => {
  return items.reduce((sum, item) => {
    return item.type === 'expense' ? sum - item.amount : sum + item.amount;
  }, 0);
};

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
    const dailylist = filteredList.value.filter((r) => r.date === dateStr);
    days.push({
      date: i,
      fullDate: dateStr,
      incomeSum: dailylist
        .filter((r) => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0),
      expenseSum: dailylist
        .filter((r) => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0),
    });
  }
  return days;
});

const selectedDatelist = computed(() =>
  filteredList.value.filter((r) => r.date === clickedDateText.value),
);
const handleMonthChange = (date) => {
  selectedDate.value = date;
};
const showDailyDetail = (day) => {
  clickedDateText.value = day.fullDate;
  isDetailOpen.value = true;
};
const isToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0];
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
.home-container {
  width: 100%;
  height: calc(100vh - 136px);
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.fixed-header {
  flex-shrink: 0;
  background-color: #fff;
  z-index: 10;
  border-bottom: 1px solid #f5f5f5;
}
.month-header {
  padding: 15px 0;
  display: flex;
  justify-content: center;
}
.toggle-section {
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
}
.view-toggle {
  display: flex;
  background-color: #f0ece1;
  border-radius: 20px;
  overflow: hidden;
}
.view-toggle button {
  padding: 5px 14px;
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
}
.calendar-view {
  padding: 5px;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 13px;
  color: #bbb;
  margin-bottom: 10px;
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
  gap: 2px;
}
.day-cell {
  min-height: 85px;
  border-top: 1px solid #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.date-num {
  font-size: 14px;
  margin-top: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-num.today {
  background: #ffc107;
  color: #fff;
  border-radius: 50%;
}
.day-amounts {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 10px;
  text-align: right;
  padding-right: 4px;
}
.amt.income {
  color: #6c8fc7;
}
.amt.expense {
  color: #ef5350;
}
.bottom-sheet-overlay {
  position: fixed;
  inset: 0;
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
  border-radius: 20px 20px 0 0;
  padding: 20px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}
.handle {
  width: 40px;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin: 0 auto 15px;
}
.sheet-content {
  overflow-y: auto;
  flex: 1;
}
</style>
