<template>
  <div class="container">
    <h1>Register Problem Page</h1>
    <p>Users can submit new problems here.</p>
    <p>Only users with advanced user permissions can use it.</p>
    <p>User Permissions : beginner / advanced</p>
    <router-link to="/">Click to Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'RegisterProblemPage',
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 가운데 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
}
</style>