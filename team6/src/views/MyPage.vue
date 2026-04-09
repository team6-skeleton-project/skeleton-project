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
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import axios from 'axios';

const userStore = useUserStore();
const router = useRouter();
const user = userStore.user;

const newPassword = ref('');
const newNickname = ref(user?.nickname || '');

const save = async () => {
  await axios.patch(`http://localhost:3000/users/${user.id}`, {
    password: newPassword.value || user.password,
    nickname: newNickname.value,
  });
  alert('수정되었습니다.');
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
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
