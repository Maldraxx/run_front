// src/composables/useAuth.js
import { reactive, readonly } from 'vue';

const state = reactive({
  user: null
});

export default function useAuth() {
  const setUser = (user) => {
    state.user = user;
  };

  const clearUser = () => {
    state.user = null;
  };

  return {
    state: readonly(state),
    setUser,
    clearUser
  };
}
