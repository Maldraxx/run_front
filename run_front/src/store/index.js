import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    token: null,
    skill: null,
    username: null,
    posts: [], // 게시글 데이터
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
    setPosts(state, posts) {
      state.posts = posts;
    },
    addPost(state, post) {
      state.posts.push(post);
    },
    updatePost(state, updatedPost) {
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        state.posts.splice(index, 1, updatedPost);
      }
    },
    deletePost(state, postId) {
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.skill = null;
      state.username = null;
      state.posts = [];
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
    },
  },
  actions: {
    login({ commit }, { user, token, skill, username }) {
      commit("setUser", user);
      commit("setToken", token);
      commit("setSkill", skill);
      commit("setUsername", username);
    },
    logout({ commit }) {
      commit("clearAuth");
    },
    fetchPosts({ commit }) {
      // 실제 API 호출로 대체 필요
      const posts = [
        { id: 1, title: "First Post", author: "User1" },
        { id: 2, title: "Second Post", author: "User2" },
      ];
      commit("setPosts", posts);
    },
    addPost({ commit }, post) {
      // 실제 API 호출로 대체 필요
      commit("addPost", post);
    },
    updatePost({ commit }, updatedPost) {
      // 실제 API 호출로 대체 필요
      commit("updatePost", updatedPost);
    },
    deletePost({ commit }, postId) {
      // 실제 API 호출로 대체 필요
      commit("deletePost", postId);
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    getSkill: (state) => state.skill,
    getUsername: (state) => state.username,
    getPosts: (state) => state.posts,
  },
});

export default store;
