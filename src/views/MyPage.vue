<template>
  <div class="my-page">
    <h1>My Page</h1>
    <p>Email: {{ getUser }}</p>
    <p>Skill Level: {{ getSkill }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MyPage',
  computed: {
    ...mapGetters(['getUser', 'getSkill']),
  },
  methods: {
    ...mapActions(['fetchEmail', 'fetchSkill']),
  },
  created() {
    this.fetchEmail(); // 컴포넌트가 생성될 때 이메일을 가져옴
    this.fetchSkill(); // 컴포넌트가 생성될 때 스킬 레벨을 가져옴
  }
};
</script>

<style scoped>
.my-page {
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #003a9a;
}

p {
  font-size: 18px;
  color: #333;
}
</style>
