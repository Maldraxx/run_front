import { createStore } from "vuex";
import router from '../router';

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    skill: null,
    username: null,
    posts: [],
    showAlert: false,
    alertMessage: '',
    isLoggedIn: !!localStorage.getItem('token'),
    comments: [], // comments 초기화
    searchQuery: '',
    filteredPosts: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setSkill(state, skill) {
      state.skill = skill;
    },
    setUsername(state, username) {
      state.username = username;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.skill = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('skill');
    },
    setLogin(state, status) {
      state.isLoggedIn = status;
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    addComment(state, comment) {
      const post = state.posts.find(post => post.id === comment.postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    deleteComment(state, commentId) {
      state.comments = state.comments.filter(comment => comment.id !== commentId);
    },
    updateComment(state, updatedComment) {
      const index = state.comments.findIndex(comment => comment.id === updatedComment.id);
      if (index !== -1) {
        state.comments.splice(index, 1, updatedComment);
      }
    },
    
    addPost(state, post) {
      post.id = Date.now().toString(); // 새로운 ID 생성
      state.posts.push(post);
      router.push({ name: 'SelectedPostPage', params: { postId: post.id } });
    },
    setPosts(state, posts) {
      state.posts = posts.map(post => ({
        ...post,
        comments: post.comments || []
      }));
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    // 검색 기능
    setSearchQuery(state, query){
      state.searchQuery = query;
    },
    setFilteredPosts(state, posts){
      state.filteredPosts = posts;
    },
  },
  actions: {
    login({ commit }, { user, token, skill, username }) {
      commit("setUser", user);
      commit("setToken", token);
      commit("setSkill", skill);
      commit("setUsername", username);
      commit('setLogin', true);
    },
    logout({ commit }) {
      commit('clearAuth');
    },
    goToLoginPage() {
      router.push('/login'); // 로그인 페이지로 이동합니다.
    },
    async fetchPosts({ commit }) {
      const posts = loadPostsFromLocalStorage();
      commit('setPosts', posts);
    },
    async fetchComments({ commit }, postId) {
      // postId에 해당하는 글의 댓글을 서버에서 가져옴
      try {
        // 서버에서 댓글을 가져오는 비동기 작업을 수행합니다.
        const comments = [
          // 댓글 데이터 형식에 맞게 수정이 필요합니다.
          { id: 1, postId: postId, content: '댓글 내용 1' },
          { id: 2, postId: postId, content: '댓글 내용 2' },
          // ...
        ];
        commit('setComments', comments);
      } catch (error) {
        console.error('댓글을 불러오는 중 에러 발생:', error);
      }
    },
    async addComment({ commit, dispatch }, { postId, comment }) {
      try {
        comment.postId = postId;
        commit('addComment', comment);
        dispatch('fetchComments', postId);
      } catch (error) {
        console.error('댓글을 추가하는 중 에러 발생:', error);
      }
    },
    async updateComment({ commit }, updatedComment) {
      try { 
        commit('updateComment', updatedComment);
      } catch (error) {
        console.error('댓글을 수정하는 중 에러 발생:', error);
      }
    },
    
    async deleteComment({ commit }, commentId) {
      // commentId에 해당하는 댓글을 서버에서 삭제
      try {
        
        commit('deleteComment', commentId);
      } catch (error) {
        console.error('댓글을 삭제하는 중 에러 발생:', error);
      }
    },
       
    addPost({ commit, state }, newPost) {
      newPost.id = Date.now().toString(); // 새로운 ID 생성
      const updatedPosts = [...state.posts, newPost];
      commit('setPosts', updatedPosts);
      router.push({ name: 'SelectedPostPage', params: { postId: newPost.id } });
    },
    searchPosts({ commit, state }) {
      const query = state.searchQuery.trim().toLowerCase();
      if (query === '') {
        commit('setFilteredPosts', state.posts);
      } else {
        const filtered = state.posts.filter(post =>
          post.title.toLowerCase().includes(query)
        );
        commit('setFilteredPosts', filtered);
      }
    },
  },
  getters: {
    isAuthenticated: state => !!state.user,
    getUser: state => state.user,
    getSkill: state => state.skill,
    getPosts: state => state.posts,
    getAlertStatus: state => ({ status: state.showAlert, message: state.alertMessage }),
    getComments: state => state.comments,
    getPostById: state => postId => {
      return state.posts.find(post => post.id === postId);
    },
  },
});

const loadPostsFromLocalStorage = () => {
  const postsFromLocalStorage = localStorage.getItem('posts');
  return postsFromLocalStorage ? JSON.parse(postsFromLocalStorage) : [];
};

export default store;
