import { createStore } from "vuex";
import router from '../router';
import axios from 'axios';

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
    comments: [],
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
    setEmail(state, email) { 
      // state.user가 객체인지 확인하고, 그렇지 않은 경우 초기화
      if (typeof state.user !== 'object') {
        state.user = {};
      }
      state.user.email = email;
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
      post.id = Date.now().toString();
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
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setFilteredPosts(state, posts) {
      state.filteredPosts = posts;
    },
  },
  actions: {
    login({ commit, dispatch }, { user, token, skill, username }) {
      commit("setUser", user);
      commit("setToken", token);
      commit("setSkill", skill);
      commit("setUsername", username);
      commit('setLogin', true);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('skill', skill);

      // 이메일 가져오기
      dispatch('fetchEmail');
    },
    async fetchEmail({ commit, state }) {
      try {
        const response = await axios.get('https://destiny-back-63f6h32ypq-de.a.run.app/blue/account/get_user', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        const email = response.data.email;
        commit('setEmail', email);
      } catch (error) {
        console.error('이메일을 불러오는 중 에러 발생:', error);
      }
    },
    async fetchSkill({ commit, state }) {
      try {
        const response = await axios.post('https://destiny-back-63f6h32ypq-de.a.run.app/blue/account/set_user_skill', null, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        const skill = response.data.skill;
        commit('setSkill', skill);
      } catch (error) {
        console.error('스킬 레벨을 불러오는 중 에러 발생:', error);
      }
    },
    logout({ commit }) {
      commit('clearAuth');
      router.push({ name: 'Login' });
    },
    goToLoginPage() {
      router.push('/login');
    },
    async fetchPosts({ commit }) {
      const posts = loadPostsFromLocalStorage();
      commit('setPosts', posts);
    },
    async fetchComments({ commit }, postId) {
      try {
        const comments = [
          { id: 1, postId: postId, content: '댓글 내용 1' },
          { id: 2, postId: postId, content: '댓글 내용 2' },
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
      try {
        commit('deleteComment', commentId);
      } catch (error) {
        console.error('댓글을 삭제하는 중 에러 발생:', error);
      }
    },
    addPost({ commit, state }, newPost) {
      newPost.id = Date.now().toString();
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
    getUser: state => state.user ? state.user.email : '',
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
