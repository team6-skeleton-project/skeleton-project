<template>
  <div class="home-container">
    <div class="fixed-header">
      <div class="month-header">
        <MonthSelector @changeMonth="handleMonthChange" />
      </div>
      <SummaryBar :list="finalFilteredList" />
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

        <div class="category-select-wrapper">
          <select v-model="selectedCategory" class="category-select">
            <option value="">전체</option>
            <option
              v-for="cat in recordStore.categories"
              :key="cat.id"
              :value="cat.name"
            >
              {{ cat.name }}
            </option>
          </select>
          <span class="arrow">⌄</span>
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
            v-for="day in recordStore.calendarDays"
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

      <HomeList
        v-else
        :filteredList="finalFilteredList"
        @openEdit="openEditModal"
      />
    </div>

    <div
      v-if="isDetailOpen"
      class="bottom-sheet-overlay"
      @click.self="isDetailOpen = false"
    >
      <div class="bottom-sheet">
        <div class="handle"></div>
        <div class="sheet-header">
          <div class="header-title-group">
            <span class="calendar-icon">📅</span>
            <h3>{{ clickedDateText }} 내역</h3>
          </div>
          <button class="close-x-btn" @click="isDetailOpen = false">
            <span class="x-icon">✕</span>
          </button>
        </div>

        <div class="sheet-content">
          <div v-if="selectedDatelist.length === 0" class="empty-msg-v2">
            <div class="empty-icon-mini">🔍</div>
            <p>이날은 기록된 내역이 없어요</p>
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
import { useRecordStore } from '@/stores/recordStore';
import MonthSelector from '@/components/home/MonthSelector.vue';
import SummaryBar from '@/components/home/SummaryBar.vue';
import TransactionItem from '@/components/home/TransactionItem.vue';
import HomeList from '../components/home/HomeList.vue';
import EditModal from './Edit.vue';

// 중앙 저장소 스토어 활성화
const recordStore = useRecordStore();

// 컴포넌트 로컬 상태 관리 (UI 제어용)
const viewMode = ref('calendar');
const selectedCategory = ref('');
const isEditModalOpen = ref(false);
const selectedRecord = ref(null);
const isDetailOpen = ref(false);
const clickedDateText = ref('');

// 컴포넌트 마운트 시 데이터가 로드되지 않았다면 스토어 액션 실행
onMounted(() => {
  if (!recordStore.loaded) {
    recordStore.fetchData();
  }
});

// 스토어의 전역 필터링 리스트에 로컬 카테고리 필터 추가 적용
const finalFilteredList = computed(() => {
  return recordStore.filteredList.filter((item) => {
    return !selectedCategory.value || item.category === selectedCategory.value;
  });
});

// 현재 선택된 월의 1일 시작 요일 계산 (빈 칸 생성용)
const emptyDays = computed(() => {
  return new Date(
    recordStore.selectedDate.getFullYear(),
    recordStore.selectedDate.getMonth(),
    1,
  ).getDay();
});

// 바텀 시트용: 선택된 특정 날짜의 내역만 필터링
const selectedDatelist = computed(() =>
  finalFilteredList.value.filter((r) => r.date === clickedDateText.value),
);

// 월 변경 시 스토어의 기준 날짜 상태 업데이트
const handleMonthChange = (date) => {
  recordStore.setSelectedDate(date);
};

// 특정 날짜 클릭 시 상세 내역 바텀 시트 노출
const showDailyDetail = (day) => {
  clickedDateText.value = day.fullDate;
  isDetailOpen.value = true;
};

// 오늘 날짜 여부 판단
const isToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0];

// 수정 모달 노출 및 선택된 데이터 전달
const openEditModal = (item) => {
  selectedRecord.value = item;
  isEditModalOpen.value = true;
};

// 모달 닫기 시 스토어 데이터를 다시 로드하여 최신 상태 유지
const handleModalClose = async () => {
  isEditModalOpen.value = false;
  await recordStore.fetchData();
};
</script>

<style scoped>
/* 기존 스타일 코드와 동일하여 생략 (그대로 사용하시면 됩니다) */
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
.category-select-wrapper {
  position: relative;
  margin-left: auto;
}
.category-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 8px 32px 8px 14px;
  border-radius: 20px;
  border: 1px solid #e5e5e5;
  background-color: #f9f9f9;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}
.category-select:hover {
  background-color: #f3f3f3;
}
.category-select:focus {
  border-color: #e6dfcf;
  background-color: #fff;
}
.arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
  pointer-events: none;
}
.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;
}
.header-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.calendar-icon {
  font-size: 18px;
}
.sheet-header h3 {
  font-size: 18px;
  font-weight: 800;
  color: #222;
  margin: 0;
  font-family: 'Pretendard', sans-serif;
}
.close-x-btn {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}
.x-icon {
  font-size: 16px;
  color: #888;
  font-weight: bold;
}
.close-x-btn:hover {
  background-color: #eee;
}
.close-x-btn:active {
  transform: scale(0.9);
  background-color: #e0e0e0;
}
.empty-msg-v2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: #bbb;
}
.empty-icon-mini {
  font-size: 30px;
  margin-bottom: 10px;
}
.empty-msg-v2 p {
  font-size: 14px;
  font-weight: 500;
}
</style>
