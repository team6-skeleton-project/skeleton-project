<template>
  <div class="chart-view-container">
    <div class="chart-scroll-area">
      <div class="chart-content-inner">
        <div class="month-nav">
          <button @click="changeMonth(-1)" class="nav-btn">&lt;</button>
          <h2 class="chart-title">{{ periodText }}</h2>
          <button @click="changeMonth(1)" class="nav-btn">&gt;</button>
        </div>

        <div v-if="loaded" class="charts-wrapper">
          <BarChart
            :chartData="barData"
            @onBarClick="(month) => (selectedMonth = month)"
          />
          <p class="guide-text">막대를 클릭하면 상세 내역이 나타납니다.</p>

          <div v-if="selectedMonth" class="doughnut-section">
            <div class="divider"></div>
            <h3 class="sub-title">{{ selectedMonth }} 상세 내역</h3>

            <PieChart :chartData="doughnutData" />

            <button @click="selectedMonth = null" class="close-btn">
              상세 닫기
            </button>
          </div>
        </div>

        <div v-else class="loading-container">
          <p class="loading-text">데이터를 불러오는 중...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import BarChart from '@/components/chart/BarChart.vue';
import PieChart from '@/components/chart/PieChart.vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

/**
 * 카테고리별 고유 색상 맵핑
 * 가계부 카테고리에 맞춰 일관된 색상을 제공합니다.
 */
const categoryColorMap = {
  식비: '#FF9F43', // 주황 (Orange)
  '교통/차량': '#54A0FF', // 밝은 파랑 (Light Blue)
  문화생활: '#5F27CD', // 보라 (Purple)
  '마트/편의점': '#EE5253', // 빨강 (Red)
  '패션/미용': '#FF9FF3', // 핑크 (Pink)
  생활용품: '#10AC84', // 초록 (Green)
  '주거/통신': '#00D2D3', // 민트/청록 (Teal)
  건강: '#E17055', // 테라코타/코랄 (Coral)
  교육: '#48DBFB', // 하늘 (Sky Blue)
  '경조사/회비': '#6C5CE7', // 진한 보라 (Soft Indigo)
  부모님: '#FDCB6E', // 머스타드/노랑 (Mustard/Yellow)
  기타: '#C8D6E5', // 밝은 회색 (Light Grey)
};

const loaded = ref(false);
const allRecords = ref([]);
const selectedMonth = ref(null);
const viewDate = ref(new Date());

/**
 * 현재 화면에 표시되는 연도와 월 텍스트 계산
 */
const periodText = computed(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth() + 1;
  return `${year}년 ${month}월 기준 3개월 이용 내역`;
});

/**
 * 기준일로부터 과거 3개월의 연-월(YYYY-MM) 라벨 배열 생성
 */
const displayMonths = computed(() => {
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(
      viewDate.value.getFullYear(),
      viewDate.value.getMonth() - i,
      1,
    );
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${y}-${m}`);
  }
  return months;
});

/**
 * 월 변경 버튼 클릭 시 호출 (이전/다음 달)
 */
const changeMonth = (offset) => {
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() + offset);
  viewDate.value = newDate;
  selectedMonth.value = null; // 기간 변경 시 상세 차트 초기화
};

/**
 * 전체 데이터 중 지출(expense) 항목을 월별로 합산하여 막대 차트 데이터 생성
 */
const barData = computed(() => {
  const monthlySummary = {};
  allRecords.value
    .filter((r) => r.type === 'expense')
    .forEach((r) => {
      const month = r.date.substring(0, 7);
      monthlySummary[month] = (monthlySummary[month] || 0) + r.amount;
    });

  return {
    labels: displayMonths.value,
    datasets: [
      {
        label: '월별 지출액',
        backgroundColor: '#FFCC00',
        borderRadius: 8,
        data: displayMonths.value.map((m) => monthlySummary[m] || 0),
      },
    ],
  };
});

/**
 * 선택된 월의 지출 카테고리별 통계 및 고유 색상 적용 (도넛 차트 데이터)
 */
const doughnutData = computed(() => {
  if (!selectedMonth.value) return null;

  const categorySummary = {};

  // 선택된 달의 지출 항목만 필터링하여 카테고리별 합산
  allRecords.value
    .filter((r) => r.type === 'expense' && r.date.includes(selectedMonth.value))
    .forEach((r) => {
      categorySummary[r.category] =
        (categorySummary[r.category] || 0) + r.amount;
    });

  const labels = Object.keys(categorySummary);

  // 라벨 이름(카테고리명)에 정의된 고유 색상 매칭
  const backgroundColors = labels.map(
    (name) => categoryColorMap[name] || '#CCCCCC',
  );

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        borderWidth: 0,
        data: Object.values(categorySummary),
      },
    ],
  };
});

/**
 * 컴포넌트 마운트 시 전체 거래 기록 API 호출
 */
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/records');
    allRecords.value = response.data;
    loaded.value = true;
  } catch (error) {
    console.error('Data Load Error:', error);
  }
});
</script>

<style scoped>
.chart-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
}

.chart-scroll-area {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  scrollbar-width: none; /* 파이어폭스 스크롤바 숨김 */
}
.chart-scroll-area::-webkit-scrollbar {
  display: none; /* 크롬, 사파리 스크롤바 숨김 */
}

.chart-content-inner {
  width: 100%;
  max-width: 440px;
  padding: 24px 16px 40px;
  box-sizing: border-box;
}

.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}
.nav-btn {
  background: #f8f9fa;
  border: 1px solid #eee;
  padding: 5px 12px;
  border-radius: 12px;
  cursor: pointer;
  color: #ffc107;
  font-weight: bold;
}

.charts-wrapper {
  width: 100%;
}
.guide-text {
  font-size: 12px;
  color: #aaa;
  text-align: center;
  margin-top: 10px;
}

.doughnut-section {
  margin-top: 20px;
  padding: 10px 0;
  animation: slideUp 0.3s ease-out; /* 상세 내역 등장 시 위로 올라오는 효과 */
}
.divider {
  border-top: 1px solid #f5f5f5;
  margin: 25px 0;
}
.sub-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 15px;
  color: #555;
}
.close-btn {
  display: block;
  margin: 20px auto 0;
  padding: 8px 18px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  font-size: 12px;
  color: #888;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
}
.loading-text {
  color: #ccc;
  font-size: 14px;
}

canvas {
  max-width: 100% !important;
  height: auto !important;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
