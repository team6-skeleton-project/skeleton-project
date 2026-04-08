<template>
  <router-view />
</template>

<script setup>
// 라우터가 화면을 알아서 교체해주기 때문에
// 최상위 파일인 이곳에는 별다른 로직이 필요 없습니다.
</script>

<style>
/* 🌟 앱 전체에 공통으로 적용될 기본 스타일 (Reset CSS) */

/* 1. 모든 요소의 여백을 없애고, 테두리 두께를 크기에 포함시킵니다 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 2. 바디 전체의 폰트와 배경색을 설정합니다 */
body {
  /* 가계부 앱에 어울리는 깔끔한 기본 폰트 적용 (없으면 기본 고딕) */
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;

  /* 디자인 시안과 유사한 연한 회색/베이지색 톤 배경 */
  background-color: #f5f5f5;
  color: #333;
}

/* 3. 링크(a 태그)의 밑줄을 없애고 색상을 통일합니다 */
a {
  text-decoration: none;
  color: inherit;
}

/* 4. 버튼의 기본 윤곽선을 없애 깔끔하게 만듭니다 */
button {
  outline: none;
  font-family: inherit;
}
</style>
