<template>
  <div class="form-overlay" @click.self="closeForm">
    <div class="form-card">
      <button class="close-btn" @click="closeForm">✕</button>

      <div class="input-group amount-group-container">
        <div class="amount-input-wrapper">
          <input
            type="text"
            ref="amountInputRef"
            :value="displayAmount"
            @input="handleAmountInput"
            placeholder="0"
            class="amount-input"
            inputmode="numeric"
          />
          <span
            class="currency"
            @click="focusAmountInput"
            style="cursor: pointer"
            >원</span
          >
        </div>

        <div class="quick-amount-btns">
          <button type="button" @click="addAmount(10000)">+1만</button>
          <button type="button" @click="addAmount(50000)">+5만</button>
          <button type="button" @click="addAmount(100000)">+10만</button>
          <button type="button" class="reset-btn" @click="resetAmount">
            초기화
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>제목</label>
        <input
          type="text"
          v-model="formData.title"
          placeholder="내역 제목을 입력하세요"
          class="common-input"
        />
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
            <img
              :src="getSelectedCategoryIcon()"
              class="mini-icon"
              alt="icon"
            />
            {{ formData.category }}
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

      <div class="button-group">
        <button class="submit-btn" @click="saveRecord">수정</button>
        <button class="delete-btn" @click="deleteRecord">삭제</button>
      </div>
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
                <img :src="getImageUrl(cat.icon)" class="cat-img" alt="icon" />
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
import { ref, defineEmits, defineProps, watch, onMounted, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  record: { type: Object, required: true },
});

const emit = defineEmits(['close']);

<<<<<<< Updated upstream
// 폼 데이터 및 상태 초기화
=======
// --- 상태 관리 ---
>>>>>>> Stashed changes
const formData = ref({ ...props.record });
const displayAmount = ref('');
const isSheetOpen = ref(false);
const incomeCategories = ref([]);
const expenseCategories = ref([]);
const amountInputRef = ref(null);

// --- 유틸리티 및 핸들러 ---
const formatNumber = (val) => {
  if (!val && val !== 0) return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const focusAmountInput = () => {
  if (amountInputRef.value) amountInputRef.value.focus();
};

const handleAmountInput = (e) => {
  const rawValue = e.target.value.replace(/\D/g, '');
  formData.value.amount = rawValue ? Number(rawValue) : null;
  displayAmount.value = formatNumber(rawValue);
};

const addAmount = (val) => {
  formData.value.amount = (formData.value.amount || 0) + val;
  displayAmount.value = formatNumber(formData.value.amount);
};

const resetAmount = () => {
  formData.value.amount = null;
  displayAmount.value = '';
};

<<<<<<< Updated upstream
/**
 * 이미지 파일명에 따른 동적 URL 생성
 */
const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return new URL(`../images/${fileName}`, import.meta.url).href;
};

/**
 * 선택된 카테고리의 아이콘 경로 매칭
 */
const getSelectedCategoryIcon = () => {
  const list =
    formData.value.type === 'income'
      ? incomeCategories.value
      : expenseCategories.value;
  const target = list.find((c) => c.name === formData.value.category);
  return target ? getImageUrl(target.icon) : '';
};

/**
 * 분류(수입/지출) 변경 시 카테고리 초기화
 */
=======
>>>>>>> Stashed changes
const changeType = (type) => {
  formData.value.type = type;
  formData.value.category = '';
};

<<<<<<< Updated upstream
/**
 * 카테고리 선택 및 바텀시트 닫기
 */
=======
>>>>>>> Stashed changes
const selectCategory = (name) => {
  formData.value.category = name;
  isSheetOpen.value = false;
};

<<<<<<< Updated upstream
/**
 * 초기 카테고리 데이터 로딩 (수입/지출 동시 요청)
 */
=======
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

>>>>>>> Stashed changes
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

/**
 * 현재 유형(type)에 따라 바텀시트에 표시할 리스트 계산
 */
const currentCategoryList = computed(() => {
  return formData.value.type === 'income'
    ? incomeCategories.value
    : expenseCategories.value;
});

<<<<<<< Updated upstream
/**
 * props로 넘어온 원본 데이터 변경 감지 시 폼 동기화
 */
=======
// --- 감시자 및 초기화 ---
>>>>>>> Stashed changes
watch(
  () => props.record,
  (newVal) => {
    formData.value = { ...newVal };
    displayAmount.value = formatNumber(newVal.amount);
  },
  { deep: true },
);

onMounted(() => {
  fetchCategories();
  if (formData.value.amount !== null) {
    displayAmount.value = formatNumber(formData.value.amount);
  }
});

<<<<<<< Updated upstream
/**
 * 수정사항 저장 (PUT 요청)
 */
=======
>>>>>>> Stashed changes
const saveRecord = async () => {
  if (
    !formData.value.title ||
    !formData.value.amount ||
    !formData.value.date ||
    !formData.value.category
  ) {
    alert('필수 항목(제목, 금액, 일자, 카테고리)을 모두 입력해주세요!');
    return;
  }
  try {
    await axios.put(
      `http://localhost:3000/records/${formData.value.id}`,
      formData.value,
    );
    alert('수정되었습니다! ✨');
    emit('close');
  } catch (error) {
    alert('수정 중 오류가 발생했습니다.');
  }
};

<<<<<<< Updated upstream
/**
 * 내역 삭제 (DELETE 요청)
 */
=======
>>>>>>> Stashed changes
const deleteRecord = async () => {
  if (confirm('삭제하시겠습니까?')) {
    try {
      await axios.delete(`http://localhost:3000/records/${formData.value.id}`);
      alert('삭제되었습니다. 🗑️');
      emit('close');
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};

const closeForm = () => emit('close');
</script>

<style scoped>
<<<<<<< Updated upstream
/* 모달 레이아웃 및 카드 스타일 */
=======
/* 1. 기본 레이아웃 */
>>>>>>> Stashed changes
.form-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.form-card {
  position: relative;
  width: 90%;
  max-width: 360px;
  background-color: #f2efe9;
  border-radius: 20px;
  padding: 35px 20px 25px;
  box-sizing: border-box;
<<<<<<< Updated upstream
=======
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
>>>>>>> Stashed changes
}

.close-btn {
  position: absolute;
  top: 1px;
  right: 15px;
  background: none;
  border: none;
  font-size: 22px;
  color: #aaa;
  cursor: pointer;
}

<<<<<<< Updated upstream
/* 입력 필드 공통 스타일 */
=======
/* 2. 🌟 금액 입력 및 퀵 버튼 스타일 */
.amount-group-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.amount-input-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 16px;
  border: 2px solid #eee;
  padding: 15px 20px;
  transition: all 0.2s ease;
}

.amount-input-wrapper:focus-within {
  border-color: #ffcc00;
  box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.1);
}

.amount-input {
  border: none;
  font-size: 26px;
  font-weight: 800;
  color: #333;
  outline: none;
  width: 75%;
  background: transparent;
}

.currency {
  font-size: 18px;
  color: #555;
  font-weight: bold;
}

.quick-amount-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.quick-amount-btns button {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-amount-btns button:hover {
  border-color: #ffcc00;
  background: #fffdf0;
  color: #333;
}

.quick-amount-btns .reset-btn {
  background: #fff5f5;
  color: #ff4d4f;
  border-color: #ffe3e3;
  margin-left: auto;
}

/* 3. 공통 입력 및 토글 */
>>>>>>> Stashed changes
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}
.input-group label {
  width: 75px;
  font-weight: bold;
  color: #666;
  font-size: 14px;
}
<<<<<<< Updated upstream

.amount-group {
  background: white;
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
  width: 70%;
  outline: none;
}

.category-selector-box {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.mini-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  margin-right: 8px;
  vertical-align: middle;
}

.common-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
=======
.common-input,
.category-selector-box {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 14px;
  background: #fff;
  outline: none;
}
.category-selector-box {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  color: #333;
}
.placeholder {
  color: #aaa;
>>>>>>> Stashed changes
}
.memo-input {
  height: 70px;
  resize: none;
}

.toggle-group {
  display: flex;
  flex: 1;
  gap: 8px;
}
.toggle-group button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
}
.toggle-group button.active {
  background: #555;
  color: #fff;
  border-color: #555;
}

<<<<<<< Updated upstream
/* 하단 버튼 스타일 */
=======
>>>>>>> Stashed changes
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.submit-btn {
  flex: 2;
  padding: 16px;
  background-color: #ffcc00;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
}
.delete-btn {
  flex: 1;
  padding: 16px;
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

<<<<<<< Updated upstream
/* 바텀 시트 UI 및 애니메이션 */
=======
/* 4. 바텀 시트 및 애니메이션 */
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  z-index: 2000;
  transition: opacity 0.3s ease;
>>>>>>> Stashed changes
}
.bottom-sheet-content {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 20px 40px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
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
<<<<<<< Updated upstream
  width: 54px;
  height: 54px;
  background: #f5f5f5;
=======
  width: 50px;
  height: 50px;
  background: #f8f8f8;
>>>>>>> Stashed changes
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cat-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
.category-item.active .cat-icon-circle {
  background: #ffcc00;
}
.cat-name {
  font-size: 12px;
  color: #666;
}

<<<<<<< Updated upstream
=======
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}
.slide-up-enter-from .bottom-sheet-content,
.slide-up-leave-to .bottom-sheet-content {
  transform: translateY(100%);
}
>>>>>>> Stashed changes
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease;
}
.slide-up-enter-active .bottom-sheet-content,
.slide-up-leave-active .bottom-sheet-content {
  transition: transform 0.3s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}
.slide-up-enter-from .bottom-sheet-content,
.slide-up-leave-to .bottom-sheet-content {
  transform: translateY(100%);
}
</style>
