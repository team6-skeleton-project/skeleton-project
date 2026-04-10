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

        <!-- 날짜 그룹 UI 추가 -->
        <div v-else>
          <div
            v-for="date in sortedDates"
            :key="date"
            style="margin-bottom:20px;"
          >
            <!-- 날짜 헤더 -->
            <div style="padding:18px 16px 8px;">
              <div style="font-size:14px; color:#888; margin-bottom:4px;">
                {{ formatDate(date) }}
              </div>

              <div style="font-size:20px; font-weight:700; color:#111; text-align:right;">
                {{ getDailyTotal(groupedList[date]).toLocaleString() }}원
              </div>
            </div>

            <!-- 거래 리스트 -->
            <TransactionItem
              v-for="item in groupedList[date]"
              :key="item.id"
              v-bind="item"
              @click="openEditModal(item)"
            />

            <!-- 그룹 구분 -->
            <div style="height:6px; background:#f5f5f5;"></div>
          </div>
        </div>
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

const viewMode = ref('calendar');
const selectedDate = ref(new Date());
const list = ref([]);
const categories = ref([]); // DB 카테고리 정보 저장용
const isEditModalOpen = ref(false);
const selectedRecord = ref(null);

const isDetailOpen = ref(false);
const clickedDateText = ref('');

/**
 * 상세 내역 리스트 (아이콘 경로가 포함된 filteredList 재사용)
 */
const selectedDatelist = computed(() => {
  return filteredList.value.filter((r) => r.date === clickedDateText.value);
});

/**
 * API 데이터 호출 (내역 + 카테고리 마스터)
 */
const fetchData = async () => {
  try {
    const [recRes, incRes, expRes] = await Promise.all([
      axios.get('http://localhost:3000/records'),
      axios.get('http://localhost:3000/incomeCategory'),
      axios.get('http://localhost:3000/expenseCategory'),
    ]);
    // 카테고리 통합
    categories.value = [...incRes.data, ...expRes.data];
    list.value = recRes.data;
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  }
};

onMounted(() => fetchData());

const showDailyDetail = (day) => {
  clickedDateText.value = day.fullDate;
  isDetailOpen.value = true;
};

const handleMonthChange = (date) => {
  selectedDate.value = date;
};

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
      // DB 카테고리 테이블에서 일치하는 icon 파일명 찾기
      const categoryInfo = categories.value.find(
        (c) => c.name === item.category,
      );
      const fileName = categoryInfo ? categoryInfo.icon : '18.png';

      return {
        ...item,
        iconPath: `/src/images/${fileName}`, // 자식 props 이름과 일치
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 날짜별 그룹
const groupedList = computed(() => {
  const result = {}

  filteredList.value.forEach(item => {
    const key = item.date
    if (!result[key]) result[key] = []
    result[key].push(item)
  })

  return result
})

// 날짜 정렬
const sortedDates = computed(() => {
  return Object.keys(groupedList.value).sort((a, b) => {
    return new Date(b) - new Date(a)
  })
})

// 날짜 포맷
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  const week = ['일','월','화','수','목','금','토']
  return `${d.getDate()}일 ${week[d.getDay()]}요일`
}

// 하루 합계
const getDailyTotal = (items) => {
  return items.reduce((sum, item) => {
    return item.type === 'expense'
      ? sum - item.amount
      : sum + item.amount
  }, 0)
}

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
    // const dailylist = list.value.filter((r) => r.date === dateStr);
    const dailylist = filteredList.value.filter((r) => r.date === dateStr);
    const incomeSum = dailylist
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const expenseSum = dailylist
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    days.push({ date: i, fullDate: dateStr, incomeSum, expenseSum });
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
/* 기존 스타일 그대로 유지 */
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
  background-color: #fff;
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
  font-weight: bold;
  color: #bbb;
  margin-bottom: 10px;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 85px;
  border-top: 1px solid #f9f9f9;
}
.date-num {
  font-size: 14px;
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.date-num.today {
  background-color: #ffc107;
  color: #fff;
}
.day-amounts {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 4px;
  gap: 2px;
}
.amt {
  font-size: 10px;
  font-weight: 600;
  text-align: right;
}
.amt.income {
  color: #6c8fc7;
}
.amt.expense {
  color: #ef5350;
}
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
.sheet-content {
  overflow-y: auto;
  flex: 1;
}
.close-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
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
