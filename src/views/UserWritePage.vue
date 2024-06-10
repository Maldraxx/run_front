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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.form-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  align-self: flex-start;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel-button, .submit-button {
  padding: 10px 15px;
  color: #003a9a;
  border: 1px solid #003a9a;
  background-color: transparent;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color color 0.3s ease, border-color 0.3s ease;
}

.cancel-button:hover, .submit-button:hover {
  background-color: #fff; /* 호버 시 배경색 유지 */
  color: #87CEEB; /* 호버 시 글씨 색상 하늘색 */
  border-color: #87CEEB; /* 호버 시 테두리 색상 하늘색 */
}
</style>