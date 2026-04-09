<template>
  <router-view />
</template>

<script setup>
// 라우터가 화면을 알아서 교체해주기 때문에
// 최상위 파일인 이곳에는 별다른 로직이 필요 없습니다.
</script>

<style>
/* 1. 브라우저 기본 여백 없애기 */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;

  /* (선택) 앱 바깥쪽(PC 바탕) 배경을 어두운 회색으로 하면 모바일 앱이 더 돋보입니다! */
  background-color: #e0e0e0;
}

/* 🌟 2. 여기가 핵심! 모든 Vue 컴포넌트를 담는 가장 큰 상자(#app)를 가운데 정렬시킵니다 */
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center; /* 가로 정중앙 배치 */
}

/* 아래는 기존에 작성해두신 a 태그, button 등 초기화 CSS 그대로 두시면 됩니다 */
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
  color: inherit;
}
button {
  outline: none;
  font-family: inherit;
}
</style>
