<template>
  <div class="write-page">
    <form @submit.prevent="handleSubmit" class="form-container">
      <h2 class="title">게시글 작성</h2>
      <input v-model="title" name="title" type="text" placeholder="제목" class="form-input" required />
      <textarea v-model="content" class="form-textarea" placeholder="내용을 입력하세요." rows="10" required></textarea>
      <div class="button-container">
        <button type="button" @click="handleCancel" class="cancel-button">취소</button>
        <button type="submit" class="submit-button">게시하기</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const title = ref('');
    const content = ref('');
    const store = useStore();
    const router = useRouter();

    const userEmail = computed(() => store.getters.getUser);

    const handleSubmit = () => {
      const titleValue = title.value.trim();
      const contentValue = content.value.trim();

      if (!titleValue || !contentValue) {
        alert('내용을 추가해주세요');
        return;
      }

      const email = userEmail.value;

      const newPost = {
        title: titleValue,
        content: contentValue,
        username: email, // username 필드에 이메일 추가
        date: new Date().toISOString(),
      };

      store.dispatch('addPost', newPost);
      router.push('/community');
    };

    const handleCancel = () => {
      router.push('/community');
    };

    return {
      title,
      content,
      handleSubmit,
      handleCancel,
      userEmail,
    };
  },
};
</script>

<style scoped>
.write-page {
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.title {
  color: #003a9a;
  margin-bottom: 20px;
}

.form-input,
.form-textarea {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.submit-button {
  background-color: #4caf50;
  color: white;
}
</style>
