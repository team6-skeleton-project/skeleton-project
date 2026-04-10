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
import { ref, defineEmits, defineProps, watch, onMounted, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  record: { type: Object, required: true },
});

const emit = defineEmits(['close']);

// 상태 관리
const formData = ref({ ...props.record });
const incomeCategories = ref([]);
const expenseCategories = ref([]);
const isSheetOpen = ref(false);

// 분류 변경 시 카테고리 리셋 함수 추가
const changeType = (type) => {
  formData.value.type = type;
  formData.value.category = '';
};

// 카테고리 선택
const selectCategory = (name) => {
  formData.value.category = name;
  isSheetOpen.value = false;
};

// 아이콘 매핑 (추가된 카테고리 포함)
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

// 데이터 로딩
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

// 감시자
watch(
  () => props.record,
  (newVal) => {
    formData.value = { ...newVal };
  },
  { deep: true },
);

onMounted(() => fetchCategories());

// 수정 저장
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

// 삭제
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
/* 메인 폼 스타일 */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
.input-group label {
  width: 70px;
  font-weight: bold;
  color: #555;
}
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
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.submit-btn {
  flex: 2;
  padding: 15px;
  background: #ffcc00;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.delete-btn {
  flex: 1;
  padding: 15px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

/* 카테고리 선택 박스 */
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

/* 🌟 바텀 시트 오버레이 (배경 고정 및 페이드 효과) */
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.bottom-sheet-content {
  width: 100%;
  max-width: 480px;
  background: white;
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

/* 🌟 애니메이션 분리 핵심 */
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0; /* 배경만 투명해짐 */
}

.slide-up-enter-from .bottom-sheet-content,
.slide-up-leave-to .bottom-sheet-content {
  transform: translateY(100%); /* 판만 아래로 */
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
