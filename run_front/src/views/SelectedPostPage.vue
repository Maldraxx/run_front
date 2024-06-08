<template>
    <div class="selected-post" v-if="selectedPost">
      <h2>{{ selectedPost.title }}</h2>
      <p>{{ selectedPost.content }}</p>
      <div class="post-meta">
        <span class="post-author">{{ selectedPost.author }}</span>
        <span class="post-date">{{ formatDate(selectedPost.date) }}</span>
      </div>
      <button @click="goBack">목록으로 돌아가기</button>
    </div>
    <div v-else>
      <p>게시글을 불러오는 중입니다...</p>
    </div>
</template>
  
<script>
  
  export default {
    data() {
      return {
        selectedPost: null
      };
    },
    created() {
      this.fetchPost(); // 페이지가 로드될 때 게시물 가져오기
    },
    methods: {
      fetchPost() {
        const postId = this.$route.params.postId; // 라우트로부터 postId 가져오기
        if (postId) {
          const post = this.$store.getters.getPostById(postId); // Vuex store에서 게시물 가져오기
          if (post) {
            this.selectedPost = post;
          } else {
            console.error('게시글을 찾을 수 없습니다.');
          }
        } else {
          console.error('postId가 제공되지 않았습니다.');
        }
      },
      goBack() {
        this.$router.go(-1); // 이전 페이지로 이동
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    },
    watch: {
      // 라우트 변경 감지
      $route() {
        this.fetchPost(); // 라우트가 변경될 때마다 게시물 다시 가져오기
      }
    }
  };
</script>
  
    
  <style scoped>
  /* 스타일링 추가 */
  </style>
  