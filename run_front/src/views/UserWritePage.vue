<template>
  <div class="write-page">
    <form @submit.prevent="handleSubmit" class="form-container">
      <h2 class="title">게시글 작성</h2>
      <!-- 수정된 부분: 제목 입력란 추가 -->
      <input v-model="title" name="title" type="text" placeholder="제목" class="form-input" required />
      <textarea v-model="content" class="form-textarea" placeholder="내용을 입력하세요." rows="10" required></textarea>
      <div class="button-container">
        <button type="button" @click="handleCancel" class="cancel-button">취소</button>
        <Button type="submit" class="submit-button">게시하기</Button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
// Button 컴포넌트 임포트

export default {
  
  setup() {
    const title = ref('');
    const content = ref('');
    const store = useStore();
    const router = useRouter();

    const handleSubmit = () => {
      // 제목과 내용을 가져옵니다.
      const titleValue = title.value.trim();
      const contentValue = content.value.trim();
      
      // 제목 또는 내용이 비어 있는지 확인합니다.
      if (!titleValue || !contentValue) {
        // 비어 있는 경우 알림을 표시하고 함수를 종료합니다.
        alert('내용을 추가해주세요');
        return;
      }

      console.log('제목:', titleValue);
      console.log('내용:', contentValue);

      // 새로운 게시글 객체 생성
      const newPost = {
        title: titleValue,
        content: contentValue,
        author: store.getters.getUser ? store.getters.getUser.username : '익명', // 사용자 이름 가져오기
        date: new Date().toISOString(), // 현재 날짜를 ISO 문자열로 변환하여 추가합니다.
      };

      // Vuex store에 새로운 게시글 추가
      store.dispatch('addPost', newPost);

      // 게시가 완료되면 커뮤니티 페이지로 이동합니다.
      router.push('/community');
    };

    const handleCancel = () => {
      // 게시 취소 시 커뮤니티 페이지로 이동합니다.
      router.push('/community');
    };
    return {
      title,
      content,
      handleSubmit,
      handleCancel,
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
