<template>
  <div>
    <h2>커뮤니티 글 목록</h2>
    <button @click="goToWritePage">글 작성하기</button>
    <div v-if="posts.length">
      <div v-for="post in posts" :key="post.id">
        <router-link :to="'/post/' + post.id">{{ post.title }}</router-link>
        <button @click="editPost(post.id)">수정</button>
        <button @click="deletePostById(post.id)">삭제</button>
      </div>
    </div>
    <div v-else>
      <p>작성된 글이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CommunityPage',
  computed: {
    ...mapGetters(['getPosts']),
    posts() {
      return this.getPosts;
    },
  },
  methods: {
    ...mapActions(['deletePost', 'fetchPosts']),
    goToWritePage() {
      this.$router.push('/write');
    },
    editPost(postId) {
      this.$router.push(`/write/${postId}`);
    },
    deletePostById(postId) {
      this.deletePost(postId);
    },
  },
  mounted() {
    this.fetchPosts(); // 페이지 로드 시 글 목록을 가져옴
  },
};
</script>

<style scoped>
/* 스타일 추가 또는 수정 가능 */
</style>
