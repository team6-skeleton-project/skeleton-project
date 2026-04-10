<template>
  <div class="container" v-if="user">
    <div class="header">
      <button class="back-btn" @click="$router.back()">←</button>
      <div class="header-title">마이페이지</div>
    </div>

    <div class="content">
      <div class="user-info">
        <div class="avatar">👤</div>
        <p class="email">{{ user.email }}</p>
      </div>

      <div class="field">
        <label class="label"><span>*</span>비밀번호 변경</label>
        <input
          v-model="newPassword"
          type="password"
          class="input-capsule"
          placeholder="새 비밀번호 입력"
        />
      </div>

      <div class="field">
        <label class="label"><span>*</span>이름 변경</label>
        <input
          v-model="newNickname"
          class="input-capsule"
          placeholder="변경할 이름"
        />
      </div>

      <div class="footer">
        <button class="btn-main" @click="save">회원정보 수정 완료</button>
        <button class="btn-sub" @click="logout">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const user = ref(null);
const newPassword = ref('');
const newNickname = ref('');

onMounted(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
    // db.json의 필드명(name)에 맞춰 초기값 세팅
    newNickname.value = user.value.name || '';
  } else {
    router.push('/login');
  }
});

const save = async () => {
  try {
    await axios.patch(`http://localhost:3000/users/${user.value.id}`, {
      password: newPassword.value || user.value.password,
      name: newNickname.value,
    });

    const updatedUser = { ...user.value, name: newNickname.value };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    user.value = updatedUser;

    alert('수정되었습니다.');
  } catch (err) {
    alert('수정 실패! 서버를 확인하세요.');
  }
};

const logout = () => {
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<style scoped>
.container {
  /* 🌟 MainLayout과 완벽하게 규격 일치 */
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  /* 공통 헤더를 대신하는 마이페이지 전용 상단 바 */
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  background-color: #fff;
  flex-shrink: 0; /* 헤더 크기 고정 */
}

.back-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.header-title {
  font-weight: 700;
  font-size: 16px;
}

.content {
  /* 홈 화면과 동일한 좌우 여백(24px) 적용 */
  padding: 30px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  font-size: 50px;
  margin-bottom: 10px;
}

.email {
  color: #888;
  font-size: 14px;
}

.field {
  margin-bottom: 24px;
}

.label {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  display: block;
  color: #333;
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
  box-sizing: border-box;
  font-size: 15px;
  background-color: #fafafa;
}

.input-capsule:focus {
  border-color: #ffcc00;
  background-color: #fff;
}

.footer {
  margin-top: auto; /* 버튼들을 하단으로 밀어냄 */
  padding-top: 20px;
}

.btn-main {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: none;
  background: #ffcc00;
  color: white;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-main:active {
  background: #e6b800;
}

.btn-sub {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: 1px solid #eee;
  background: #fafafa;
  color: #999;
  font-size: 15px;
  margin-bottom: 20px;
  cursor: pointer;
}
</style>
