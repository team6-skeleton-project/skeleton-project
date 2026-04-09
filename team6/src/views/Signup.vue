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

      <div class="field">
        <label class="label"><span>*</span>닉네임</label>
        <input
          v-model="form.nickname"
          class="input-capsule"
          placeholder="닉네임을 입력하세요"
        />
      </div>

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
  // 1. 유효성 검사
  if (!form.value.email || !form.value.password || !form.value.name) {
    return alert('필수 항목을 입력해주세요.');
  }
  if (form.value.password !== passwordConfirm.value) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  try {
    // 2. 중복 체크
    const checkRes = await axios.get(
      `http://localhost:3000/users?email=${form.value.email}`,
    );
    if (checkRes.data.length > 0) {
      return alert('이미 가입된 이메일입니다.');
    }

    // 3. 회원 저장
    await axios.post('http://localhost:3000/users', form.value);
    alert('가입을 환영합니다! 로그인 해주세요.');
    router.push('/login');
  } catch (err) {
    alert('서버 오류 발생');
  }
};
</script>

<style scoped>
/* 이전 스타일과 동일 */
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
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
  padding: 24px;
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
  cursor: pointer;
}
.form-scroll::-webkit-scrollbar {
  display: none;
}
</style>
