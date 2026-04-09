<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-wrapper">
        <img src="@/assets/AppLogo.png" alt="앱 로고" class="app-logo" />
      </div>

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

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await axios.get('http://localhost:3000/users');
    const users = res.data;
    const loggedInUser = users.find(
      (u) =>
        u.email === email.value.trim() && u.password === password.value.trim(),
    );

    if (loggedInUser) {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      alert(`${loggedInUser.name}님, 환영합니다!`);
      router.push('/');
    } else {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  } catch (err) {
    alert('서버 확인 필요!');
  }
};
</script>

<style scoped>
.login-container {
  /* 🌟 홀쭉이 탈출 핵심: 너비 고정 */
  width: 100%;
  max-width: 480px;
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 40px; /* 좌우 여백을 넓혀서 안정감 부여 */
  background-color: #fff;
}

.login-box {
  width: 100%;
}

.logo-wrapper {
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}

.app-logo {
  width: 180px; /* 로고 시원하게 키움 */
  height: auto;
}

.input-group {
  margin-bottom: 16px;
}

.input-capsule {
  width: 100%;
  height: 54px; /* 입력창 살짝 키움 */
  border-radius: 27px;
  border: 1px solid #eee;
  padding: 0 24px;
  font-size: 16px;
  background-color: #fafafa;
  outline: none;
}

.btn-login {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: none;
  background: #ffcc00;
  color: white;
  font-weight: 700;
  font-size: 17px;
  margin-top: 20px;
}

.link-signup {
  text-align: center;
  color: #aaa;
  font-size: 14px;
  margin-top: 25px;
  cursor: pointer;
}
</style>
