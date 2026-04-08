<template>
  <div class="bottom-nav">
    
    <div class="nav-item">🏠</div>

    <div class="fab">+</div>

    <div class="nav-item">📊</div>

  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 390px;
  height: 80px;
  background: #FFC107;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

/* 좌우 아이콘 */
.nav-item {
  font-size: 24px;
  color: white;
}

/* 가운데 + 버튼 */
.fab {
  position: absolute;
  top: -25px;
  width: 60px;
  height: 60px;
  background: #fff;
  color: #FFC107;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
</style>