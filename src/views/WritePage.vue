<template>
    <div>
      <h2 v-if="isEditMode">글 수정하기</h2>
      <h2 v-else>글 작성하기</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="title">제목</label>
          <input type="text" v-model="title" id="title" required />
        </div>
        <button type="submit">{{ isEditMode ? '수정' : '작성' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        title: '',
        isEditMode: false,
        postId: null,
      };
    },
    methods: {
      ...mapActions(['addPost', 'updatePost']),
      async handleSubmit() {
        if (this.isEditMode) {
          await this.updatePost({ id: this.postId, title: this.title });
        } else {
          await this.addPost({ id: Date.now(), title: this.title }); // 임시 ID 사용
        }
        this.$router.push('/community');
      },
    },
    mounted() {
      if (this.$route.params.id) {
        this.isEditMode = true;
        this.postId = this.$route.params.id;
        const post = this.$store.getters.getPosts.find(post => post.id === Number(this.postId));
        if (post) {
          this.title = post.title;
        }
      }
    },
  };
  </script>
  
  <style scoped>
  /* 스타일 추가 또는 수정 가능 */
  </style>
  