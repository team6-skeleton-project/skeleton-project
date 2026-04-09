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
            @click="formData.type = 'income'"
          >
            수입
          </button>
          <button
            type="button"
            :class="{ active: formData.type === 'expense' }"
            @click="formData.type = 'expense'"
          >
            지출
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>카테고리</label>
        <select v-model="formData.category" class="common-input">
          <option value="" disabled>카테고리를 선택하세요</option>
          <option v-if="formData.type === 'income'" value="월급">월급</option>
          <option v-if="formData.type === 'income'" value="용돈">용돈</option>
          <option v-if="formData.type === 'expense'" value="식비">식비</option>
          <option v-if="formData.type === 'expense'" value="교통비">
            교통비
          </option>
        </select>
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
  </div>
</template>

<script setup>
// 🌟 defineEmits 추가
import { ref, defineEmits } from 'vue';

const formData = ref({
  amount: null,
  date: '',
  type: 'expense',
  category: '',
  memo: '',
});

// 🌟 부모 컴포넌트(하단 바)에게 '나 닫아줘!'라고 신호를 보내기 위한 설정
const emit = defineEmits(['close']);

const saveRecord = () => {
  if (
    !formData.value.amount ||
    !formData.value.date ||
    !formData.value.category
  ) {
    alert('필수 항목을 모두 입력해주세요!');
    return;
  }
  console.log('저장할 데이터:', formData.value);

  // TODO: Axios 통신 로직

  // 🌟 저장이 완료되면 자동으로 모달 창 닫기
  emit('close');
};

const closeForm = () => {
  // 🌟 X 버튼이나 배경을 누르면 부모에게 'close' 신호 보내기
  emit('close');
};
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
</style>
