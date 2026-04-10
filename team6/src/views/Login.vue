<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-wrapper">
        <img src="@/images/AppLogo.png" alt="앱 로고" class="app-logo" />
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
  /* 🌟 홈 화면(MainLayout)과 규격 맞추기 */
  width: 100%;
  max-width: 480px; /* 폰 규격 고정 */
  margin: 0 auto; /* PC 화면 중앙 정렬 */
  height: 100vh;
  background-color: #fff;

  /* 🌟 홈 화면과 동일한 그림자 적용 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;

  /* 🌟 좌우 패딩을 40px에서 24px로 줄여서 홈 화면과 비율을 맞춤 */
  padding: 0 24px;
  box-sizing: border-box;
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
  width: 180px; /* 로고 크기는 유지 */
  height: auto;
  object-fit: contain;
}

.input-group {
  margin-bottom: 16px;
}

.input-capsule {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: 1px solid #eee;
  padding: 0 24px;
  font-size: 16px;
  background-color: #fafafa;
  outline: none;
}

/* 포커스 시 테두리 색상 추가 (선택사항) */
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
  font-size: 17px;
  margin-top: 20px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-login:active {
  opacity: 0.8;
}

.link-signup {
  text-align: center;
  color: #aaa;
  font-size: 14px;
  margin-top: 25px;
  cursor: pointer;
}
</style>
