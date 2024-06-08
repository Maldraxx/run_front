import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    token: null,
    skill: null,
    posts: [], // 커뮤니티 글 데이터 추가
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
    setPosts(state, posts) {
      state.posts = posts;
    },
    addPost(state, post) {
      state.posts.push(post);
    },
    updatePost(state, updatedPost) {
      const index = state.posts.findIndex(post => post.id === updatedPost.id);
      if (index !== -1) {
        state.posts.splice(index, 1, updatedPost);
      }
    },
    deletePost(state, postId) {
      state.posts = state.posts.filter(post => post.id !== postId);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.skill = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
    },
  },
  actions: {
    login({ commit }, { user, token, skill }) {
      commit('setUser', user);
      commit('setToken', token);
      commit('setSkill', skill);
    },
    logout({ commit }) {
      commit('clearAuth');
    },
    async fetchPosts({ commit }) {
      // 실제 API 호출로 대체 필요
      const posts = [
        { id: 1, title: 'First Post' },
        { id: 2, title: 'Second Post' },
      ];
      commit('setPosts', posts);
    },
    async addPost({ commit }, post) {
      // 실제 API 호출로 대체 필요
      commit('addPost', post);
    },
    async updatePost({ commit }, updatedPost) {
      // 실제 API 호출로 대체 필요
      commit('updatePost', updatedPost);
    },
    async deletePost({ commit }, postId) {
      // 실제 API 호출로 대체 필요
      commit('deletePost', postId);
    },
  },
  getters: {
    isAuthenticated: state => !!state.user,
    getUser: state => state.user,
    getSkill: state => state.skill,
    getPosts: state => state.posts,
  },
});

export default store;
