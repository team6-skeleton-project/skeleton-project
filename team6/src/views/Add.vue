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
import { ref, defineEmits, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRecordStore } from '@/stores/recordStore'; // 🌟 Pinia 스토어 임포트

// --- 상태 관리 ---
const recordStore = useRecordStore(); // 🌟 스토어 활성화

const formData = ref({
  amount: null,
  title: '',
  date: new Date().toISOString().split('T')[0],
  type: 'expense',
  category: '',
  memo: '',
});

const displayAmount = ref('');
const isSheetOpen = ref(false);
const incomeCategories = ref([]);
const expenseCategories = ref([]);
const emit = defineEmits(['close']);
const amountInputRef = ref(null);

// --- 유틸리티 및 핸들러 ---
const focusAmountInput = () => {
  if (amountInputRef.value) amountInputRef.value.focus();
};

const formatNumber = (val) => {
  if (!val && val !== 0) return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

const getImageUrl = (fileName) => {
  if (!fileName) return '';
  // src/images 폴더를 가리키는 동적 URL 생성
  return new URL(`../images/${fileName}`, import.meta.url).href;
};

const getSelectedCategoryIcon = () => {
  const list =
    formData.value.type === 'income'
      ? incomeCategories.value
      : expenseCategories.value;
  const target = list.find((c) => c.name === formData.value.category);
  return target ? getImageUrl(target.icon) : '';
};

const changeType = (type) => {
  formData.value.type = type;
  formData.value.category = '';
};

const selectCategory = (name) => {
  formData.value.category = name;
  isSheetOpen.value = false;
};
const API_URL = import.meta.env.VITE_API_URL; //상단에 변수 선언
const fetchCategories = async () => {
  try {
    const [incRes, expRes] = await Promise.all([
      axios.get(`${API_URL}/incomeCategory`),
      axios.get(`${API_URL}/expenseCategory`),
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

/**
 * 내역 저장 실행 (Pinia 연동)
 */
const saveRecord = async () => {
  if (
    !formData.value.title ||
    !formData.value.amount ||
    !formData.value.date ||
    !formData.value.category
  ) {
    alert('필수 항목(제목, 금액, 일자, 카테고리) 모두 입력해주세요!');
    return;
  }
  try {
    const user = JSON.parse(localStorage.getItem('user')); // 로컬스토리지에서 실제 유저 ID 가져오기
    const payload = { ...formData.value, userId: user.id };
    await axios.post(`${API_URL}/records`, payload);

    // 🌟 저장 성공 후 Pinia 스토어 데이터 갱신 (화면 실시간 반영용)
    await recordStore.fetchData();

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
/* 기존 스타일 그대로 유지됨 (변동 없음) */
.selected-value {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mini-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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
.submit-btn {
  width: 100%;
  padding: 16px;
  background-color: #ffcc00;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(255, 204, 0, 0.2);
}
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
  transition: opacity 0.3s ease;
}
.bottom-sheet-content {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 20px 40px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
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
  background: #f8f8f8;
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
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}
.slide-up-enter-from .bottom-sheet-content,
.slide-up-leave-to .bottom-sheet-content {
  transform: translateY(100%);
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease;
}
.slide-up-enter-active .bottom-sheet-content,
.slide-up-leave-active .bottom-sheet-content {
  transition: transform 0.3s ease-out;
}
</style>
