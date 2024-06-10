<template>
  <div class="post-container">
    <div class="selected-post" v-if="selectedPost">
      <div class="post-header">
        <h2>{{ selectedPost.title }}</h2>
        <div class="post-meta">
          <span class="post-author">{{ selectedPost.author }}</span>
          <span class="post-date">{{ formatDate(selectedPost.date) }}</span>
          <span class="post-views">조회수: {{ selectedPost.views }}</span>
          <span class="post-recommends">추천: {{ selectedPost.recommends }}</span>
        </div>
      </div>
      <div class="post-content">
        <p>{{ selectedPost.content }}</p>
      </div>
      <div class="comments-section">
        <h3>댓글</h3>
        <div class="comment" v-for="comment in selectedPost.comments" :key="comment.id">
          <div class="comment-meta">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-date">{{ formatDate(comment.date) }}</span>
          </div>
          <p>{{ comment.content }}</p>
        </div>
        <div class="add-comment">
          <h4>댓글 달기</h4>
          <div class="comment-input">
            <textarea
              v-model="newComment.content"
              placeholder="댓글 내용을 입력하세요"
              @keyup.enter="submitComment"
            ></textarea>
            <button @click="submitComment">등록</button>
          </div>
        </div>
      </div>
      <div class="post-footer">
        <button @click="goBack">돌아가기</button>
      </div>
    </div>
    <div v-else>
      <p>게시글을 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPost: null,
      newComment: {
        content: ''
      }
    };
  },
  created() {
    this.fetchPost();
  },
  methods: {
    fetchPost() {
      const postId = this.$route.params.postId;
      if (postId) {
        const post = this.$store.getters.getPostById(postId);
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
      this.$router.go(-1);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    submitComment() {
      if (this.newComment.content) {
        const comment = {
          id: Date.now(),
          author: `익명 (${Math.floor(Math.random() * 1000) + 1}) `,
          content: this.newComment.content,
          date: new Date().toISOString()
        };
        this.$store.dispatch('addComment', { postId: this.selectedPost.id, comment });
        this.newComment.content = '';
      } else {
        alert('댓글 내용을 입력하세요.');
      }
    },
  },
  watch: {
    $route() {
      this.fetchPost();
    },
    'selectedPost.comments': function () {
      this.$store.dispatch('fetchComments', this.selectedPost.id);
    }
  },
};
</script>


<style scoped>
.post-container {
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
  max-width: 900px; /* 최대 너비를 900px로 설정 */
  margin: 50px auto 0 auto; /* 위쪽에 50px 여백을 추가하여 네비게이션 바에서 떨어뜨림 */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 50px); /* 전체 뷰포트 높이에서 50px을 뺀 높이를 사용하여 중앙 정렬 */
}

.selected-post {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  padding: 20px;
  width: 800px; /* 너비를 800px로 설정 */
  display: flex;
  flex-direction: column;
}

.post-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.post-meta {
  font-size: 14px;
  color: #888;
}

.post-views,
.post-recommends {
  margin-left: 10px;
}

.post-content {
  font-size: 16px;
  line-height: 1.6;
}

.post-footer {
  text-align: center; /* 중앙 정렬 */
  margin-top: 20px;
}

.comments-section {
  margin-top: 30px;
  flex-grow: 1;
}

.comment {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

.comment-meta {
  font-size: 14px;
  color: #888;
  margin-bottom: 5px;
}

.add-comment {
  margin-top: 20px;
}

.comment-input {
  display: flex;
  align-items: flex-start;
}

.comment-input textarea {
  width: 100%;
  margin-right: 10px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  height : 70px;
}

button {
  padding: 10px 15px;
  color: #003a9a;
  border: 1px solid #003a9a;
  background-color: transparent;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color color 0.3s ease, border-color 0.3s ease;
  white-space: nowrap;
  height : 70px;
}

button:hover {
  background-color: #fff; /* 호버 시 배경색 유지 */
  color: #87CEEB; /* 호버 시 글씨 색상 하늘색 */
  border-color: #87CEEB; /* 호버 시 테두리 색상 하늘색 */
}
</style>
