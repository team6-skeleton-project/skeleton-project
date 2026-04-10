<template>
  <div class="container">
    <div class="header">
      <button class="back-btn" @click="$router.push('/login')">←</button>
      <div class="header-title">회원가입</div>
    </div>

    <div class="form-scroll">
      <div class="field">
        <label class="label"><span>*</span>이메일</label>
        <input
          v-model="form.email"
          class="input-capsule"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div class="field">
        <label class="label"><span>*</span>비밀번호</label>
        <input
          v-model="form.password"
          type="password"
          class="input-capsule mb-8"
          placeholder="비밀번호 입력"
        />
        <input
          v-model="passwordConfirm"
          type="password"
          class="input-capsule"
          placeholder="비밀번호 확인"
        />
      </div>

      <div class="field">
        <label class="label"><span>*</span>이름</label>
        <input
          v-model="form.name"
          class="input-capsule"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div class="field">
        <label class="label"><span>*</span>생년월일</label>
        <input
          v-model="form.birth"
          class="input-capsule"
          placeholder="YYYY.MM.DD"
        />
      </div>

      <!-- <div class="field">
        <label class="label"><span>*</span>닉네임</label>
        <input
          v-model="form.nickname"
          class="input-capsule"
          placeholder="닉네임을 입력하세요"
        />
      </div> -->

      <button class="btn-main" @click="handleSignup">회원 가입</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const passwordConfirm = ref('');
const form = ref({
  email: '',
  password: '',
  name: '',
  birth: '',
  nickname: '',
});

const handleSignup = async () => {
  if (!form.value.email || !form.value.password || !form.value.name) {
    return alert('필수 항목을 입력해주세요.');
  }
  if (form.value.password !== passwordConfirm.value) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  try {
    const checkRes = await axios.get(
      `http://localhost:3000/users?email=${form.value.email}`,
    );
    if (checkRes.data.length > 0) {
      return alert('이미 가입된 이메일입니다.');
    }

    await axios.post('http://localhost:3000/users', form.value);
    alert('가입을 환영합니다! 로그인 해주세요.');
    router.push('/login');
  } catch (err) {
    alert('서버 오류 발생');
  }
};
</script>

<style scoped>
.container {
  /* 🌟 MainLayout 규격 일치화 */
  width: 100%;
  max-width: 480px; /* 폰 규격 고정 */
  margin: 0 auto; /* PC 중앙 정렬 */
  min-height: 100vh; /* 내용이 길어도 배경 유지 */
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* 그림자 추가 */

  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  background-color: #fff; /* 헤더 배경 고정 */
}

.back-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.header-title {
  font-weight: 700;
}

.form-scroll {
  padding: 24px; /* 홈 화면과 일치하는 여백 */
  flex: 1;
  overflow-y: auto;
}

.field {
  margin-bottom: 20px;
}

.label {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  display: block;
}

.label span {
  color: #ffcc00;
  margin-right: 4px;
}

.input-capsule {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  padding: 0 20px;
  outline: none;
  box-sizing: border-box; /* 패딩이 너비에 영향 안 주게 고정 */
}

.input-capsule:focus {
  border-color: #ffcc00;
}

.mb-8 {
  margin-bottom: 8px;
}

.btn-main {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: none;
  background: #ffcc00;
  color: white;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 30px; /* 하단 여백 추가 */
  cursor: pointer;
}

.form-scroll::-webkit-scrollbar {
  display: none;
}
</style>
