<template>
  <div class="form-overlay">
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
import { ref } from 'vue';

// 폼 데이터 상태 관리 (초기값 세팅)
const formData = ref({
  amount: null,
  date: '', // datetime-local 형식에 맞게 yyyy-mm-ddThh:mm 형태로 들어갑니다.
  type: 'expense', // 기본값을 지출로 설정
  category: '',
  memo: '',
});

// 저장 버튼 클릭 이벤트
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
  // TODO: 여기서 Axios를 통해 json-server로 POST 요청을 보냅니다.
};

// 닫기 버튼 이벤트
const closeForm = () => {
  console.log('폼 닫기');
  // TODO: vue-router를 이용해 이전 페이지로 돌아가거나 모달을 닫는 로직 추가
};
</script>

<style scoped>
/* 1. 배경 및 카드 레이아웃 */
.form-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5; /* 시안의 배경색과 유사하게 */
  min-height: 100vh;
}

.form-card {
  background-color: #f2efe9; /* 카드 고유의 베이지 톤 */
  border-radius: 12px;
  padding: 30px 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 2. 닫기 버튼 */
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

/* 3. 공통 입력 폼 레이아웃 */
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

/* 4. 금액 입력란 특화 스타일 */
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

/* 5. 일반 입력 필드 (일자, 카테고리, 메모) */
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

/* 6. 수입/지출 토글 버튼 */
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

/* 7. 저장 버튼 */
.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #ffcc00; /* 시안의 노란색 */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
</style>
