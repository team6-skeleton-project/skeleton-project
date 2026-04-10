<template>
  <router-view />
</template>

<style>
/* 🌟 반드시 최상단으로 옮겨주세요! */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

:root {
  --font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
}
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  font-family: var(--font-family);
  margin: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center; /* 자식인 MainLayout이나 Login을 가로 중앙에 배치 */
}

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
  cursor: pointer;
}
</style>
