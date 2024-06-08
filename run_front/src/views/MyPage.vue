<template>
  <div class="my-page">
    <h1>My Page</h1>
    <p>Email: {{ getUser }}</p>
    <p>Skill Level: {{ getSkill }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MyPage',
  computed: {
    ...mapGetters(['getUser', 'getSkill']),
  },
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
