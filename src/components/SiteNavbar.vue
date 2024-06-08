<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link">Home</router-link>
    <router-link to="/quiz" class="nav-link">Quiz</router-link>
    <router-link to="/register-problem" class="nav-link">RegisterProblem</router-link>
    <router-link to="/solution" class="nav-link">Solution</router-link>
    <router-link to="/community" class="nav-link">Community</router-link>
    <div v-if="!isAuthenticated" class="auth-buttons">
      <button @click="login" class="nav-link action-button">Login</button>
    </div>
    <div v-else class="auth-buttons">
      <router-link :to="{ name: 'MyPage' }" class="nav-link username">{{ getUser }}</router-link>
      <button @click="handleLogout" class="nav-link action-button">Logout</button>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "SiteNavbar",
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser']),
  },
  methods: {
    ...mapActions(['logout']),
    login() {
      this.$router.push({ name: 'Login' });
    },
    handleLogout() {
      this.logout();
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center; /* 중앙 배치 */
  gap: 50px; /* 버튼 간 50px 거리 */
  background-color: #f2f2f2; /* 바탕색 */
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 살짝의 그림자 */
}

.nav-link, .action-button {
  color: #003a9a; /* 버튼 색상 */
  text-decoration: none;
  font-weight: bold;
  background: none; /* 배경 제거 */
  border: none; /* 테두리 제거 */
  cursor: pointer;
  padding: 0;
}

.nav-link:hover, .action-button:hover {
  text-decoration: underline;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 50px; /* 버튼 간 50px 거리 */
}

.username {
  font-weight: bold;
  color: #003a9a;
}
</style>
