<template>
  <div class="form-overlay" @click.self="closeForm">
    <div class="form-card">
      <button class="close-btn" @click="closeForm">✕</button>

      <div class="input-group amount-group">
        <input
          type="number"
          v-model="formData.amount"
          placeholder="0"
          class="amount-input"
        />
        <span class="currency">원 ✏️</span>
      </div>

      <div class="input-group">
        <label>일자</label>
        <input type="date" v-model="formData.date" class="common-input" />
      </div>

      <div class="input-group">
        <label>분류</label>
        <div class="toggle-group">
          <button
            type="button"
            :class="{ active: formData.type === 'income' }"
            @click="changeType('income')"
          >
            수입
          </button>
          <button
            type="button"
            :class="{ active: formData.type === 'expense' }"
            @click="changeType('expense')"
          >
            지출
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>카테고리</label>
        <div class="category-selector-box" @click="isSheetOpen = true">
          <span v-if="formData.category" class="selected-value">
            {{ getCategoryIcon(formData.category) }} {{ formData.category }}
          </span>
          <span v-else class="placeholder">카테고리를 선택하세요</span>
          <span class="arrow">▼</span>
        </div>
      </div>

      <div class="input-group align-top">
        <label>메모</label>
        <textarea
          v-model="formData.memo"
          class="common-input memo-input"
        ></textarea>
      </div>

      <button class="submit-btn" @click="saveRecord">저장</button>
    </div>

    <Transition name="slide-up">
      <div
        v-if="isSheetOpen"
        class="bottom-sheet-overlay"
        @click.self="isSheetOpen = false"
      >
        <div class="bottom-sheet-content">
          <div class="sheet-header">
            <div class="handle"></div>
            <h3>카테고리 선택</h3>
          </div>

          <div class="category-grid">
            <div
              v-for="cat in currentCategoryList"
              :key="cat.id"
              class="category-item"
              :class="{ active: formData.category === cat.name }"
              @click="selectCategory(cat.name)"
            >
              <div class="cat-icon-circle">
                <span class="cat-icon">{{ getCategoryIcon(cat.name) }}</span>
              </div>
              <span class="cat-name">{{ cat.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, computed } from 'vue';
import axios from 'axios';

const formData = ref({
  amount: null,
  date: new Date().toISOString().split('T')[0], // 오늘 날짜 기본값
  type: 'expense',
  category: '',
  memo: '',
});

const emit = defineEmits(['close']);
const isSheetOpen = ref(false);
const incomeCategories = ref([]);
const expenseCategories = ref([]);

// 🌟 수입/지출 변경 시 카테고리 초기화
const changeType = (type) => {
  formData.value.type = type;
  formData.value.category = '';
};

const selectCategory = (name) => {
  formData.value.category = name;
  isSheetOpen.value = false;
};

const getCategoryIcon = (name) => {
  const iconMap = {
    식비: '🍽️',
    '교통/차량': '🚗',
    월급: '💰',
    용돈: '💸',
    '패션/미용': '💄',
    '마트/편의점': '🛒',
    기타: '🎸',
    부수입: '🧧',
    문화생활: '🎬',
    생활용품: '🧺',
    '주거/통신': '🏠',
    건강: '💊',
  };
  return iconMap[name] || '📍';
};

const fetchCategories = async () => {
  try {
    const [incRes, expRes] = await Promise.all([
      axios.get('http://localhost:3000/incomeCategory'),
      axios.get('http://localhost:3000/expenseCategory'),
    ]);
    incomeCategories.value = incRes.data;
    expenseCategories.value = expRes.data;
  } catch (error) {
    console.error('카테고리 로딩 실패:', error);
  }
};

const currentCategoryList = computed(() => {
  return formData.value.type === 'income'
    ? incomeCategories.value
    : expenseCategories.value;
});

const saveRecord = async () => {
  if (
    !formData.value.amount ||
    !formData.value.date ||
    !formData.value.category
  ) {
    alert('필수 항목을 모두 입력해주세요!');
    return;
  }
  try {
    // userId 하드코딩 추가 (나중에 로그인 기능 연결 시 수정)
    const payload = { ...formData.value, userId: 'u001' };
    await axios.post('http://localhost:3000/records', payload);
    alert('저장되었습니다!');
    emit('close');
  } catch (error) {
    alert('서버 저장에 실패했습니다.');
  }
};

const closeForm = () => emit('close');

onMounted(() => fetchCategories());
</script>

<style scoped>
/* 🌟 1. 배경을 화면 전체에 고정(fixed)시키고 반투명하게 만듭니다. */
/* 1. 까만 배경을 앱 사이즈에 딱 맞게 가두기 */
.form-overlay {
  position: fixed;
  top: 0;
  bottom: 0;

  /* 🌟 모바일 뼈대와 똑같이 가운데로 모아줍니다 */
  left: 0;
  right: 0;
  margin: 0 auto;

  width: 100%;
  max-width: 480px; /* 🚨 중요: App.vue에서 설정한 앱 전체 너비 숫자와 똑같이 맞춰주세요! (예: 400px, 480px 등) */

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 2. 도망간 X 버튼을 카드 안으로 다시 불러오기 */
.form-card {
  position: relative; /* 🌟 핵심! 이 한 줄이 있어야 내부의 X 버튼(absolute)이 도망가지 않습니다. */

  width: 90%;
  max-width: 340px;
  background-color: #f2efe9;
  border-radius: 12px;
  padding: 30px 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.close-btn {
  position: absolute;
  top: 1px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  color: #888;
  cursor: pointer;
}
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.input-group.align-top {
  align-items: flex-start;
}
.input-group label {
  width: 70px;
  font-weight: bold;
  color: #555;
}
.amount-group {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 30px;
  justify-content: space-between;
}
.amount-input {
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #555;
  outline: none;
  width: 70%;
}
.currency {
  font-size: 18px;
  color: #555;
  font-weight: bold;
}
.common-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}
.memo-input {
  height: 80px;
  resize: none;
}
.toggle-group {
  display: flex;
  flex: 1;
  gap: 10px;
}
.toggle-group button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  color: #555;
}
.toggle-group button.active {
  border-color: #555;
  font-weight: bold;
  box-shadow: inset 0 0 0 1px #555;
}
.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #ffcc00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
/* 선택 박스 스타일 */
.category-selector-box {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

/* 바텀 시트 오버레이 */
/* 1. 배경 오버레이: 고정된 상태에서 투명도만 조절 (Fade 효과) */
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;

  /* 배경 자체에 트랜지션 효과 부여 */
  transition: opacity 0.3s ease;
}

/* 2. 흰색 판: 아래에서 위로 슬라이드 (Slide 효과) */
.bottom-sheet-content {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 20px 40px 20px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);

  /* 판 자체에 트랜지션 효과 부여 */
  transition: transform 0.3s ease-out;
}

.sheet-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.handle {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin-bottom: 15px;
}

/* 카테고리 그리드 레이아웃 (이미지+텍스트) */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.cat-icon-circle {
  width: 50px;
  height: 50px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.category-item.active .cat-icon-circle {
  background: #ffcc00;
}

.cat-name {
  font-size: 12px;
  color: #666;
}

/* 3. 애니메이션 (아래에서 위로만 슥!) */
/* 시작(Enter) / 끝(Leave) 상태 */
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0; /* 배경은 투명해짐 */
}

.slide-up-enter-from .bottom-sheet-content,
.slide-up-leave-to .bottom-sheet-content {
  transform: translateY(100%); /* 흰색 판만 아래로 내려감 */
}

/* 활성화(Active) 상태 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease; /* 배경 애니메이션 속도 */
}

.slide-up-enter-active .bottom-sheet-content,
.slide-up-leave-active .bottom-sheet-content {
  transition: transform 0.3s ease-out; /* 판 애니메이션 속도 */
}
</style>
