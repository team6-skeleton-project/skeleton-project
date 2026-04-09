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

      <div class="button-group">
        <button class="submit-btn" @click="saveRecord">수정</button>
        <button class="delete-btn" @click="deleteRecord">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

// 폼 데이터 상태 관리
const formData = ref({
  amount: null,
  date: '',
  type: 'expense',
  category: '',
  memo: '',
});

const emit = defineEmits(['close']);

// 저장(수정) 버튼 클릭 이벤트
const saveRecord = () => {
  if (
    !formData.value.amount ||
    !formData.value.date ||
    !formData.value.category
  ) {
    alert('필수 항목을 모두 입력해주세요!');
    return;
  }
  console.log('수정할 데이터:', formData.value);
  // TODO: 여기서 Axios를 통해 json-server로 PUT 요청을 보냅니다.
  emit('close');
};

// 삭제 버튼 클릭 이벤트
const deleteRecord = () => {
  if (confirm('정말로 이 내역을 삭제하시겠습니까?')) {
    console.log('삭제 진행');
    // TODO: 여기서 Axios를 통해 json-server로 DELETE 요청을 보냅니다.
    emit('close');
  }
};

// 닫기 버튼 이벤트
const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
/* 1. 까만 배경을 앱 사이즈에 딱 맞게 가두기 */
.form-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;

  /* 만약 MainLayout 크기를 100%로 늘리셨다면 이 줄을 지우셔도 됩니다 */
  max-width: 480px;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 0;
}

/* 2. 하얀색 팝업 카드 */
.form-card {
  position: relative;
  width: 90%;
  max-width: 340px;
  background-color: #f2efe9;
  border-radius: 12px;
  padding: 30px 20px;
  box-sizing: border-box;
  margin: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 3. 닫기 버튼 (위치 안정화) */
.close-btn {
  position: absolute;
  top: 1px; /* 1px에서 15px로 내려서 더 자연스럽게 맞췄습니다 */
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  color: #888;
  cursor: pointer;
}

/* 공통 입력 폼 레이아웃 */
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

/* 금액 입력란 특화 스타일 */
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

/* 일반 입력 필드 (일자, 카테고리, 메모) */
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

/* 수입/지출 토글 버튼 */
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

/* 🌟 하단 버튼 그룹 스타일 (수정/삭제 나란히 배치) */
.button-group {
  display: flex;
  gap: 10px; /* 두 버튼 사이의 간격 */
  margin-top: 10px;
}

.submit-btn {
  flex: 2; /* 수정 버튼을 더 넓게 (가로 비율 2) */
  padding: 15px;
  background-color: #ffcc00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.delete-btn {
  flex: 1; /* 삭제 버튼은 조금 좁게 (가로 비율 1) */
  padding: 15px;
  background-color: #ff4d4f; /* 삭제 경고용 빨간색 */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>
