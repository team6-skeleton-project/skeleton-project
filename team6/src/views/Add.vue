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

// 폼 입력 데이터 초기값 설정
const formData = ref({
  amount: null,
  date: new Date().toISOString().split('T')[0],
  type: 'expense',
  category: '',
  memo: '',
});

const emit = defineEmits(['close']);
const isSheetOpen = ref(false);
const incomeCategories = ref([]);
const expenseCategories = ref([]);

/**
 * DB에 정의된 파일명을 기반으로 이미지의 동적 URL 생성
 */
const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return new URL(`../images/${fileName}`, import.meta.url).href;
};

/**
 * 현재 선택된 카테고리명과 일치하는 아이콘 이미지 경로 반환
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
 * 수입/지출 분류 변경 시 카테고리 선택 초기화
 */
const changeType = (type) => {
  formData.value.type = type;
  formData.value.category = '';
};

/**
 * 바텀시트에서 카테고리 선택 처리
 */
const selectCategory = (name) => {
  formData.value.category = name;
  isSheetOpen.value = false;
};

/**
 * API를 통한 카테고리 목록 로드
 */
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
 * 현재 선택된 분류(수입/지출)에 따른 카테고리 목록 필터링
 */
const currentCategoryList = computed(() => {
  return formData.value.type === 'income'
    ? incomeCategories.value
    : expenseCategories.value;
});

/**
 * 내역 저장 실행
 */
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
/* 레이아웃 및 카드 스타일 */
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
  max-width: 340px;
  background-color: #f2efe9;
  border-radius: 12px;
  padding: 30px 20px;
  box-sizing: border-box;
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

/* 입력 그룹 공통 스타일 */
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
  outline: none;
  width: 70%;
}

.mini-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-right: 8px;
  vertical-align: middle;
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

.common-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
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
  background: white;
  border-radius: 8px;
  cursor: pointer;
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
}

/* 바텀 시트 스타일 */
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
  width: 54px;
  height: 54px;
  background: #f5f5f5;
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

/* 애니메이션 */
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
