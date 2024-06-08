<template>
  <div class="home">
    <div class="central-image">
      <img :src="centralImagePath" alt="Central Image" />
    </div>
  </div>
</template>

<script>
import centralImage from '@/assets/MainPage.png';

export default {
  data() {
    return {
      centralImagePath: centralImage
    };
  }
};
</script>

<style scoped>
.home {
  background-color: #f2f2f2; /* 페이지 전체 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 페이지 전체 높이 */
}

.central-image {
  width: 720px; /* 원하는 이미지의 폭 */
  height: 300px; /* 원하는 이미지의 높이 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.central-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 이미지의 비율을 유지하면서 컨테이너에 맞게 조정 */
}
</style>
