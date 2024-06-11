import { createRouter, createWebHistory } from "vue-router";
import store from '../store';

import HomePage from "../views/HomePage.vue";
import QuizPage from "../views/QuizPage.vue";
import CommunityPage from "../views/CommunityPage.vue";
import RegisterProblemPage from "../views/RegisterProblemPage.vue";
import SolutionPage from "../views/SolutionPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import MyPage from "../views/MyPage.vue";
import UserWritePage from "../views/UserWritePage.vue";
import SelectedPostPage from "../views/SelectedPostPage.vue"
// import ListEx from "../views/ListEx.vue"

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/quiz", name: "Quiz", component: QuizPage },
  { path: "/community", name: "Community", component: CommunityPage },
  { path: "/register-problem", name: "RegisterProblem", component: RegisterProblemPage },
  { path: "/solution", name: "Solution", component: SolutionPage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/mypage", name: "MyPage", component: MyPage },
  { path: "/userwritepage", name: "UserWritePage", component: UserWritePage },
  { path: '/post/:postId', name: 'SelectedPostPage', component: SelectedPostPage, props: true },
  // { path: '/ListEx', name: 'ListEx', component: ListEx}
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.isLoggedIn;
  const requiresAuthPaths = ['/quiz', '/solution', '/register-problem', '/mypage'];
  if (!isLoggedIn && requiresAuthPaths.includes(to.path)) {
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
