<template>
  <Header></Header>
</template>

<script setup>
import Header from './layout/Header.vue';
</script>

<style>
.app {
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  background: #f5f5f5;
}

.content {
  padding-top: 56px;
  height: 100%;
  overflow-y: auto;
}
</style>
