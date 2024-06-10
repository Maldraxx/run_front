<template>
  <div class="community">
    <div class="community-header">
      <h2>커뮤니티 게시판</h2>
      <div class="header-actions">
        <MaterialInput
          class="search-input"
          icon="search"
          type="text"
          v-model="searchQuery"
          placeholder="검색어 입력"
          size="sm"
        />
        <button class="btn-search" @click="searchPosts">검색</button>
        <button class="btn-write" @click="goToWritePage">게시글 작성</button>
      </div>
    </div>

    <div class="community-posts">
      <div v-if="selectedPostId === null">
        <div v-for="(post, index) in filteredPosts" :key="post.id" class="post">
          <router-link :to="{ name: 'SelectedPostPage', params: { postId: post.id } }" class="post-title">
            {{ index + 1 }}. {{ post.title }}
          </router-link>
          <div class="post-meta">
            <span class="post-author">{{ post.Username }}</span>
            <span class="post-date">{{ formatDate(post.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <section class="py-7">
    <div class="container">
      <div class="row justify-space-between py-2">
        <div class="col-lg-4 mx-auto">
          <MaterialPagination>
            <MaterialPaginationItem prev class="ms-auto">
              <i class="fas fa-angle-double-left"></i>
            </MaterialPaginationItem>
            <MaterialPaginationItem label="1" active />
            <MaterialPaginationItem label="2" />
            <MaterialPaginationItem label="3" />
            <MaterialPaginationItem label="4" />
            <MaterialPaginationItem label="5" />
            <MaterialPaginationItem next>
              <i class="fas fa-angle-double-right"></i>
            </MaterialPaginationItem>
          </MaterialPagination>
        </div>
      </div>
    </div>
    <div id="discord-widget-container" v-if="showDiscordWidget" class="discord-widget">
          <!-- Discord 위젯이 렌더링될 위치 -->
    </div>
  </section>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MaterialPagination from '../components/MaterialPagination.vue';
import MaterialPaginationItem from '../components/MaterialPaginationItem.vue';
import MaterialInput from '../components/MaterialInput.vue';

export default {
  methods: {
    
    requestFeedback(){
      this.showDiscordWidget=!this.showDiscordWidget;

      if(this.showDiscordWidget){
        new window.Crate({
          server:'1249634517908586568', // chatbot
          channel: '1249668339136073750' // #커뮤니티 채널
        })
      }
    }
  },
  mounted() {
    const script = document.createElement("script");
    script.src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3";
    script.async = true;
    script.defer = true; 
    script.onload = () => {
      if(typeof window.Crate !== "undefined"){
        console.log("Discord 위젯 스크립트 로드 완료");
        this.requestFeedback();
      } else {
        console.error('Crate failed to load')
      }
    };
    this.requestFeedback();
    document.head.appendChild(script);
  },
  beforeRouteLeave(to, from, next) {
    this.showDiscordWidget = false;
    next();
  },
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const router = useRouter();
    const selectedPostId = ref(null);
    const showDiscordWidget = ref(true);
    const filteredPosts = computed(() => {
      const posts = store.getters.getPosts;
      if (searchQuery.value.trim() === '') {
        return posts;
      } else {
        return posts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
        );
      }
    });
    watch(router, () => {
        showDiscordWidget.value = false;
      });

    const searchPosts = () => {
      const matchingPost = filteredPosts.value[0];
      if (matchingPost) {
        selectedPostId.value = matchingPost.id;
      } else {
        alert('검색어에 해당하는 게시글이 없습니다.');
      }
    };

    const goToWritePage = () => {
      if (store.getters.isAuthenticated) {
        router.push('/userwritepage');
      } else {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        store.dispatch('goToLoginPage');
      }
    };

    const addNewPost = post => {
      const user = store.getters.getUser;
      post.Username = user ? user.username : '익명';
      store.dispatch('addPost', post);
    };

    const toggleDetail = postId => {
      if (selectedPostId.value === postId) {
        selectedPostId.value = null;
      } else {
        selectedPostId.value = postId;
      }
    };

    const clearSelectedPost = () => {
      selectedPostId.value = null;
    };

    const formatDate = dateString => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    };

    return {
      filteredPosts,
      searchQuery,
      searchPosts,
      goToWritePage,
      addNewPost,
      toggleDetail,
      selectedPostId,
      formatDate,
      clearSelectedPost,
      showDiscordWidget,
      selectedPost: computed(() =>
        store.getters.getPosts.find(post => post.id === selectedPostId.value)
      ),
    };
  },
  components: {
    MaterialPagination,
    MaterialPaginationItem,
    MaterialInput,
  },
  
};
</script>


<style scoped>
.community {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.header-actions button {
  margin-left: 8px;
}

.btn-write, .btn-search {
  color: #003a9a; /* 기본 글씨 색상 */
  border: 1px solid #003a9a; /* 기본 테두리 색상 */
  background: none; /* 배경 제거 */
  cursor: pointer;
  padding: 6px 10px; /* 크기 조정 */
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s; /* 호버 시 반응 추가 */
  border-radius: 4px; /* 테두리 둥글게 */
  height: 40px; /* search-input과 같은 높이 */
  width: 80px; /* 넓이 조정 */
  font-size: 14px; /* 폰트 크기 줄이기 */
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap; /* 텍스트 한 줄로 유지 */
}

.btn-write:hover, .btn-search:hover {
  background-color: #fff; /* 호버 시 배경색 유지 */
  color: #87CEEB; /* 호버 시 글씨 색상 하늘색 */
  border-color: #87CEEB; /* 호버 시 테두리 색상 하늘색 */
}

.search-input {
  padding: 6px 10px; /* 크기 조정 */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.community-posts {
  display: block;
}

.post {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.post h3 {
  margin-top: 0;
}

.post-title {
  font-size: 1.2em;
  margin-bottom: 8px;
  cursor: pointer;
}

.post-content {
  margin-bottom: 12px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
}

.post-author,
.post-date {
  color: #6c757d;
}
.discord-widget {
  margin-top: 20px; /* Discord 위젯과 다른 컨텐츠 간의 간격 조정 */
  z-index: 999;
}

</style>
