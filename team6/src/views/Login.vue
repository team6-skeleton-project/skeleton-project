<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">가계부에 오신 것을<br />환영합니다</h2>

      <div class="input-group">
        <input
          v-model="email"
          class="input-capsule"
          placeholder="아이디(이메일)"
        />
      </div>
      <div class="input-group">
        <input
          v-model="password"
          type="password"
          class="input-capsule"
          placeholder="비밀번호"
          @keyup.enter="handleLogin"
        />
      </div>

      <button class="btn-login" @click="handleLogin">로그인</button>

      <div class="link-signup" @click="$router.push('/signup')">회원가입</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const email = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  try {
    // 1. 일단 모든 유저를 가져옵니다.
    const res = await axios.get('http://localhost:3000/users');
    const users = res.data;

    // 2. 입력한 값과 일치하는 유저가 있는지 자바스크립트로 직접 찾습니다.
    const loggedInUser = users.find(
      (u) =>
        u.email === email.value.trim() && u.password === password.value.trim(),
    );

    if (loggedInUser) {
      // 로그인 성공
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      alert(`${loggedInUser.name}님, 환영합니다!`);
      router.push('/');
    } else {
      // 로그인 실패
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  } catch (err) {
    alert('서버 연결 실패! json-server가 3000포트에서 실행 중인지 확인하세요.');
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
}
.login-box {
  width: 100%;
  margin-bottom: 60px;
}
.title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 40px;
  line-height: 1.4;
  color: #333;
}
.input-group {
  margin-bottom: 16px;
}
.input-capsule {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  border: 1px solid #e0e0e0;
  padding: 0 20px;
  font-size: 15px;
  outline: none;
}
.input-capsule:focus {
  border-color: #ffcc00;
}
.btn-login {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: none;
  background: #ffcc00;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}
.link-signup {
  text-align: right;
  color: #bdbdbd;
  font-size: 13px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
