<template>
  <div class="layout-content" :class="{ 'has-detail': selectedMonth }">
    <div class="chart-container">
      <div class="month-nav">
        <button @click="changeMonth(-1)" class="nav-btn">&lt;</button>
        <h2 class="chart-title">{{ periodText }}</h2>
        <button @click="changeMonth(1)" class="nav-btn">&gt;</button>
      </div>

      <div v-if="loaded" class="charts-wrapper">
        <div class="chart-box main-bar">
          <Bar :data="barData" :options="barOptions" />
          <p class="guide-text">막대를 클릭하면 상세 내역이 나타납니다.</p>
        </div>

        <div v-if="selectedMonth" class="doughnut-section">
          <div class="divider"></div>
          <h3 class="sub-title">{{ selectedMonth }} 상세 내역</h3>
          <div class="chart-box">
            <Doughnut :data="doughnutData" :options="doughnutOptions" />
          </div>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Bar, Doughnut } from 'vue-chartjs';
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

const loaded = ref(false);
const allRecords = ref([]);
const selectedMonth = ref(null);
const viewDate = ref(new Date()); // 기준 날짜

// 상단 타이틀 텍스트
const periodText = computed(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth() + 1;
  return `${year}년 ${month}월 기준 3개월 이용 내역`;
});

// 화면에 표시할 3개월 계산
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

// 월 이동 기능
const changeMonth = (offset) => {
  const newDate = new Date(viewDate.value);
  newDate.setMonth(newDate.getMonth() + offset);
  viewDate.value = newDate;
  selectedMonth.value = null; // 이동 시 도넛 차트 닫기
};

// 막대 그래프 옵션 & 클릭 이벤트
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      selectedMonth.value = barData.value.labels[index];
    }
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// 막대 그래프 데이터 가공
const barData = computed(() => {
  const expenseRecords = allRecords.value.filter((r) => r.type === 'expense');
  const monthlySummary = {};

  expenseRecords.forEach((r) => {
    const month = r.date.substring(0, 7);
    monthlySummary[month] = (monthlySummary[month] || 0) + r.amount;
  });

  return {
    labels: displayMonths.value,
    datasets: [
      {
        label: '월별 지출액',
        // 막대 그래프 색상
        backgroundColor: '#FFCC00',
        borderRadius: 8,
        data: displayMonths.value.map((m) => monthlySummary[m] || 0),
      },
    ],
  };
});

// 도넛 그래프 데이터 가공
const doughnutData = computed(() => {
  if (!selectedMonth.value) return null;
  const filtered = allRecords.value.filter(
    (r) => r.type === 'expense' && r.date.includes(selectedMonth.value),
  );
  const categorySummary = {};
  filtered.forEach((r) => {
    categorySummary[r.category] = (categorySummary[r.category] || 0) + r.amount;
  });
  return {
    labels: Object.keys(categorySummary),
    datasets: [
      {
        // 도넛 그래프 색상: 세련된 파스텔톤
        backgroundColor: [
          '#FF9F43',
          '#EE5253',
          '#10AC84',
          '#54A0FF',
          '#5F27CD',
          '#C8D6E5',
        ],
        borderWidth: 0,
        data: Object.values(categorySummary),
      },
    ],
  };
});

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
/* [핵심] 높이를 고정하지 않고 내용물에 맞춰 늘어나게 설정 */
.layout-content {
  padding-top: 56px;
  padding-bottom: 90px; /* 기본 바텀 네비게이션 공간 */
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
}

/* [핵심] 도넛 차트가 나올 때만 하단 여백을 넓혀서 스크롤 공간 확보 */
.layout-content.has-detail {
  padding-bottom: 130px;
}

.chart-container {
  padding: 24px 16px;
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
  background: none;
  border: 1px solid #eee;
  padding: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #ffc107;
  font-weight: bold;
}

.charts-wrapper {
  display: flex;
  flex-direction: column;
}

/* 막대 그래프 박스 */
.chart-box.main-bar {
  height: 260px;
  margin-bottom: 10px;
}

/* 도넛 그래프 박스 */
.chart-box {
  position: relative;
  width: 100%;
  height: 240px;
}

.guide-text {
  font-size: 12px;
  color: #aaa;
  text-align: center;
  margin-top: 8px;
}

/* 상세 영역 (클릭 시 나타남) */
.doughnut-section {
  margin-top: 20px;
  animation: slideUp 0.3s ease-out;
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
  padding: 6px 16px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 15px;
  font-size: 12px;
  color: #888;
  cursor: pointer;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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
