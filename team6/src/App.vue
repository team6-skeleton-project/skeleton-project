<template>
  <router-view />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
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
