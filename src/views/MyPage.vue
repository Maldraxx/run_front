<template>
  <div class="my-page">
    <h1>My Page</h1>
    <p>Email: {{ user.email }}</p>
    <p>Skill Level: {{ user.skill }}</p>
    <select v-model="selectedSkillLevel" @change="changeSkillLevel">
      <option v-for="level in skillLevels" :key="level" :value="level">
        {{ level }}
      </option>
    </select>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MyPage',
  data() {
    return {
      user: {
        email:'',
        skill: null,
      },
      skillLevels: [1,2,3,4,5,6,7,8,9,10],
      selectedSkillLevel: null,
    };
    },
    created() {
      this.fetchUserData();
    },
    methods: {
      async fetchUserData() {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get('https://destiny-back-63f6h32ypq-de.a.run.app/blue/account/get_user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.user.email = response.data.email;
          this.user.skill = response.data.skill;
          this.selectedSkillLevel = this.user.skill;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },
      async updateSkillLevel() {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post('https://destiny-back-63f6h32ypq-de.a.run.app/blue/account/set_user_skill', {
            skill: this.selectedSkillLevel,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Skill level updated:', response.data);
          // Optionally, you can update the user skill in the local state
          this.user.skill = this.selectedSkillLevel;
        } catch (error) {
          console.error('Error updating skill level:', error);
        }
      },
    }
  }
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
