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
        <label class="label"><span>*</span>닉네임 변경</label>
        <input
          v-model="newNickname"
          class="input-capsule"
          placeholder="변경할 닉네임"
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

// 🌟 Store 대신 직접 유저 정보를 관리합니다.
const user = ref(null);
const newPassword = ref('');
const newNickname = ref('');

onMounted(() => {
  // 1. 로컬 스토리지에서 유저 정보를 가져옵니다.
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
    newNickname.value = user.value.name || ''; // db.json에 'name'으로 저장되어 있을 거예요.
  } else {
    // 유저 정보가 없으면 로그인으로 튕겨냅니다.
    router.push('/login');
  }
});

const save = async () => {
  try {
    await axios.patch(`http://localhost:3000/users/${user.value.id}`, {
      password: newPassword.value || user.value.password,
      name: newNickname.value, // db.json 필드명에 맞춰 'name'으로 수정
    });

    // 로컬 스토리지 데이터도 갱신해줘야 화면에 즉시 반영됩니다.
    const updatedUser = { ...user.value, name: newNickname.value };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    user.value = updatedUser;

    alert('수정되었습니다.');
  } catch (err) {
    alert('수정 실패! 서버를 확인하세요.');
  }
};

const logout = () => {
  localStorage.removeItem('user'); // 로컬 스토리지 비우기
  router.push('/login');
};
</script>

<style scoped>
/* 기존 스타일 그대로 유지 (생략) */
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 56px;
} /* 헤더 가림 방지 */
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
.content {
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
}
.input-capsule {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  padding: 0 20px;
  outline: none;
}
.footer {
  margin-top: auto;
}
.btn-main {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: none;
  background: #ffcc00;
  color: white;
  font-weight: 700;
  margin-bottom: 12px;
  cursor: pointer;
}
.btn-sub {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  border: 1px solid #eee;
  background: #fafafa;
  color: #999;
  cursor: pointer;
}
</style>
