<template>
  <div class="month-selector">
    <button type="button" class="nav-btn" @click="prevMonth">&lt;</button>

    <div class="month-display" @click="openPicker">
      {{ currentMonthText }}
    </div>

    <button type="button" class="nav-btn" @click="nextMonth">&gt;</button>

    <Transition name="dialog-fade">
      <div
        v-if="isPickerOpen"
        class="picker-overlay"
        @click.self="cancelSelect"
      >
        <div class="picker-dialog" @click.stop>
          <div class="picker-header">
            <button type="button" class="year-nav" @click="tempYear--">
              ◀
            </button>
            <h3 class="year-title">{{ tempYear }}년</h3>
            <button type="button" class="year-nav" @click="tempYear++">
              ▶
            </button>
          </div>

          <div class="month-grid">
            <button
              v-for="m in 12"
              :key="m"
              type="button"
              :class="{ active: tempMonth === m - 1 }"
              @click="tempMonth = m - 1"
            >
              {{ m }}월
            </button>
          </div>

          <div class="picker-footer">
            <button type="button" class="btn-cancel" @click="cancelSelect">
              취소
            </button>
            <button type="button" class="btn-confirm" @click="confirmSelect">
              확인
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['changeMonth']);

const currentDate = ref(new Date()); // 실제 적용된 날짜
const isPickerOpen = ref(false);

// 다이얼로그 내에서 임시로 조절되는 값
const tempYear = ref(new Date().getFullYear());
const tempMonth = ref(new Date().getMonth());

// 화면에 표시될 텍스트
const currentMonthText = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  return `${year}년 ${month}월`;
});

// 🌟 창 열기: 열 때 현재 날짜를 임시 값에 복사
const openPicker = () => {
  tempYear.value = currentDate.value.getFullYear();
  tempMonth.value = currentDate.value.getMonth();
  isPickerOpen.value = true;
};

// 선택 취소: 상태만 닫음
const cancelSelect = () => {
  isPickerOpen.value = false;
};

// 확인 버튼: 임시 값을 실제 값으로 적용하고 부모에게 알림

const confirmSelect = () => {
  try {
    // 1. 혹시 모를 타입 오류 방지를 위해 숫자로 확실히 변환
    const year = Number(tempYear.value);
    const month = Number(tempMonth.value);

    // 2. 새로운 날짜 객체 생성
    const newDate = new Date(year, month, 1);

    // 3. 날짜가 유효한지 체크
    if (!isNaN(newDate.getTime())) {
      currentDate.value = newDate;
      emit('changeMonth', newDate);
    }
  } catch (error) {
    console.error('날짜 변경 중 오류 발생:', error);
  } finally {
    // 4. 🔥 무조건 실행: 에러가 나든 안 나든 일단 창은 닫습니다.
    isPickerOpen.value = false;
  }
};

// --- 화살표 내비게이션 로직 ---
const update = (date) => {
  currentDate.value = date;
  emit('changeMonth', date);
};

const prevMonth = () => {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  update(d);
};

const nextMonth = () => {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  update(d);
};
</script>

<style scoped>
.month-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
}
.nav-btn {
  background: none;
  border: 1px solid #eee;
  padding: 6px 14px;
  border-radius: 12px;
  cursor: pointer;
  color: #ffc107;
  font-weight: bold;
}
.month-display {
  font-size: 28px;
  font-weight: 800;
  color: #333;
  cursor: pointer;
}

/* 다이얼로그 오버레이 */
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
  z-index: 3000;
}

/* 다이얼로그 박스 */
.picker-dialog {
  width: 90%;
  max-width: 380px;
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.year-title {
  font-size: 22px;
  margin: 0;
  font-weight: 800;
  color: #333;
}
.year-nav {
  background: #f8f8f8;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: #ffc107;
  font-weight: bold;
}

/* 월 그리드 */
.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 30px;
}
.month-grid button {
  padding: 14px 0;
  border: 1px solid #f2f2f2;
  background: #fff;
  border-radius: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}
.month-grid button.active {
  background: #ffcc00;
  color: white;
  border-color: #ffcc00;
  box-shadow: 0 4px 10px rgba(255, 204, 0, 0.3);
}

/* 푸터 */
.picker-footer {
  display: flex;
  gap: 12px;
}
.picker-footer button {
  flex: 1;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
}
.btn-cancel {
  background: #f2f2f2;
  color: #888;
}
.btn-confirm {
  background: #ffcc00;
  color: white;
}

/* 🌟 애니메이션: 페이드 + 위에서 아래로 슬라이드 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
