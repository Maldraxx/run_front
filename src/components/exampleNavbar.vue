<script setup>
import { ref, watch, computed} from "vue";
import { useWindowsWidth } from "../assets/js/useWindowsWidth";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { defineProps, defineEmits } from 'vue';
import { watchEffect } from 'vue';
import ArrDark from "../assets/img/down-arrow-dark.svg";
import DownArrWhite from "../assets/img/down-arrow-white.svg";

const props = defineProps({
  action: {
    type: Object, 
    route: String,
    color: String,
    label: String,
    default: () => ({})
  },
  transparent: { type: Boolean, default: false },
  light: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
  sticky: { type: Boolean, default: false },
  darkText: { type: Boolean, default: false },
});
const emits = defineEmits(['toggle-menu']); // toggle-menu 이벤트 추가
//const emitToggleMenu = emits('toggle-menu');
const store = useStore();
const router = useRouter();
const menuVisible = ref(false); // 메뉴 토글 상태 추가
const toggleMenu= () => {
  menuVisible.value = !menuVisible.value;
  emits('toggle-menu', menuVisible.value); // toggle-menu 이벤트 발생
  //emitToggleMenu();
  
};


const pagesDropdownVisible = ref(false);  
const communityDropdownVisible = ref(false); 
const helloDropdownVisible = ref(false);

const togglePagesDropdown = (event) => {
  event.preventDefault(); 
  event.stopPropagation(); // 이벤트 전파 중지
  console.log("togglePagesDropdown clicked");
  pagesDropdownVisible.value = !pagesDropdownVisible.value;
  communityDropdownVisible.value = false;
  helloDropdownVisible.value = false;
};
const toggleCommunityDropdown = (event) => {
  event.preventDefault(); 
  event.stopPropagation(); // 이벤트 전파 중지
  console.log("toggleCommunityDropdown clicked");
  communityDropdownVisible.value = !communityDropdownVisible.value;
  pagesDropdownVisible.value = false;
  helloDropdownVisible.value = false;
};
const toggleHelloDropdown = (event) => {
  event.preventDefault(); 
  event.stopPropagation(); // 이벤트 전파 중지
  console.log("toggleHelloDropdown clicked");
  helloDropdownVisible.value = !helloDropdownVisible.value;
  pagesDropdownVisible.value = false;
  communityDropdownVisible.value = false;
};
const closeDropdowns = () => {
  pagesDropdownVisible.value = false;
  communityDropdownVisible.value = false;
  helloDropdownVisible.value = false;
};
router.afterEach(() => {
  closeDropdowns();
});


watchEffect(() => {
  console.log("Pages Dropdown Visible:", pagesDropdownVisible.value);
  console.log("Community Dropdown Visible:", communityDropdownVisible.value);
  console.log("Hello Dropdown Visible:", helloDropdownVisible.value);
});

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const getUser = computed(() => store.getters.getUser);

const logout = () => store.dispatch('logout');

// 사용자 이름 표시 로직
const userNameDisplay = computed(() => {
  if (isAuthenticated.value && getUser.value) {
    const email = getUser.value.email || getUser.value;
    const username = email.split('@')[0];
    return username;
  }
  return "Hello";
});
7
function login() {
  router.push({ name: 'Login' });
}

function handleLogout() {
  logout();
  router.push({ name: 'Home' });
  location.reload();
  console.log("logout");
}

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

  // set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
      color = "text-dark";
    } else if (props.transparent) {
      color = "text-white";
    } else {
      color = "text-dark";
    }

    return color;
};

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
      textDark.value = true;
    } else if (type.value === "desktop" && textDark.value == false) {
      textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);



</script>

<template>
  <nav
    class="navbar navbar-expand-lg top-0"
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
        props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
    }"
  >
    <div :class="props.transparent || props.light || props.dark
          ? 'container'
          : 'container-fluid px-0'" >

      <RouterLink
        class="navbar-brand d-none d-md-block"
        :class="[
          (props.transparent && textDark.value) || !props.transparent
            ? 'text-dark font-weight-bolder ms-sm-3'
            : 'text-white font-weight-bolder ms-sm-3'
        ]"
        :to="{ name: 'Home' }"
        rel="tooltip"
        title="Designed and Coded by Creative Tim"
        data-placement="bottom"
        style="font-size: 1.5rem;"
      >
        BlueCode
      </RouterLink>
      <RouterLink
        class="navbar-brand d-block d-md-none"
        :class="
          props.transparent || props.dark
            ? 'text-white'
            : 'font-weight-bolder ms-sm-3'
        "
        to="/"
        rel="tooltip"
        title="Designed and Coded by Creative Tim"
        data-placement="bottom"
        style="font-size: 1.5rem;"
      >
        블루코드!!!
      </RouterLink>
      <!-- <a
        href="/login"
        class="btn btn-outline-info w-auto me-2 d-lg-none d-block ms-auto login-button-container" v-if="!isAuthenticated"
        >{{ isAuthenticated ? 'Logout' : 'Login' }}</a>
        <a href="#" class="btn btn-outline-info w-auto me-2 d-lg-none d-block ms-auto login-button-container" v-else @click.prevent="handleLogout()">Logout</a> -->
      <button
        class="navbar-toggler shadow-none ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
        style="box-shadow: none !important; border: none !important;"
        @click="toggleMenu" 
      >
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div
        class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
        id="navigation"
        :class="{ 'show': menuVisible }"
      >
      <!-- Sections -->
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <!-- 문제, 해답 페이지 -->
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"  
              :class="getTextColor()"
              id="dropdownMenuPages"
              @click="togglePagesDropdown"
              aria-haspopup="true"
              data-bs-toggle="dropdown"
              :aria-expanded="pagesDropdownVisible ? 'true' : 'false'"
            >
            <i><img src="../assets/img/iconimg1.png" /></i > <!-- 여기서 material-icons 아이콘을 사용 -->
              Pages
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuPages"
              v-show="pagesDropdownVisible"
              @click.stop
              :class="{ 'show': pagesDropdownVisible }"
              style="right: 0; top: calc(100% + 10px); max-height: fit-content; overflow: hidden;"
            >
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1"
                      >
                        Study
                      </div>
                      <RouterLink
                        :to="{ name: 'Quiz' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Quiz</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'Solution' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Solution</span>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <div
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0"
                >
                  Landing Pages
                </div>
                <RouterLink
                  :to="{ name: 'Quiz' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Quiz</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'Solution' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Solution</span>
                </RouterLink>
              </div>
            </div>
          </li>
          <!-- 커뮤니티 nav --> 
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              id="dropdownMenuBlocks"
              @click="toggleCommunityDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="communityDropdownVisible ? 'true' : 'false'"
            >
            <i><img src="../assets/img/iconimg1.png" /></i >
              Community 
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuPages"
              v-show="communityDropdownVisible"
              @click.stop
              :class="{ 'show': communityDropdownVisible }"
              style="right: 0; top: calc(100% + 10px); max-height: fit-content; overflow: hidden;"
            >
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1"
                      >
                        SAAAY~
                      </div>
                      <RouterLink
                        :to="{ name: 'Community' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Communtiy</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'RegisterProblem' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Regist</span>
                      </RouterLink>
                      <!-- 기존 ListEx.vue 링크 사용해서 삭제함 -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <div
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0"
                >
                  Landing Pages
                </div>
                <RouterLink
                  :to="{ name: 'Community' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Community</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'RegisterProblem' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Regist</span>
                </RouterLink>
              </div>
            </div>

          </li>
          <!-- Sections -->
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              id="dropdownMenuDocs"
              @click="toggleHelloDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="helloDropdownVisible ? 'true' : 'f"
            >
              <i><img src="../assets/img/iconimg1.png" /></i >
                 {{ userNameDisplay }}<!-- {{ userNameDisplay }}사용자 이름 또는 기본 메시지 표시 -->
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-end dropdown-menu-animation dropdown-md mt-0 mt-lg-3 p-3 border-radius-lg"
              aria-labelledby="dropdownMenuDocs"
              v-show="helloDropdownVisible"
              @click.stop
              :class="{ 'show': helloDropdownVisible }"
              style="right: 0; top: calc(100% + 10px); max-height: fit-content; overflow: hidden;"
            >
              <div class="d-none d-lg-block">
                <ul class="list-group">
                  <li class="nav-item list-group-item border-0 p-0">
                    <a
                      class="dropdown-item py-2 ps-3 border-radius-md"
                      href="/mypage"
                    >
                      <h6
                        class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0"
                      >
                        My Page
                      </h6>
                    </a>
                  </li>
                  <li class="nav-item list-group-item border-0 p-0">
                    <a
                      class="dropdown-item py-2 ps-3 border-radius-md"
                      href="/solution"
                    >
                      <h6
                        class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0"
                      >
                        Solved
                      </h6>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="row d-lg-none">
                <div class="col-md-12 g-0">
                  <a
                    class="dropdown-item py-2 ps-3 border-radius-md"
                    href="/mypage"
                  >
                    <h6
                      class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0"
                    >
                      My Page
                    </h6>
                  
                  </a>
                  <a
                    class="dropdown-item py-2 ps-3 border-radius-md"
                    href="/solution"
                  >
                    <h6
                    class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente aign-items-center p-0"
                    >
                      Solved
                    </h6>
                  </a>
                </div>
              </div>
            </div>
          </li>
          <!-- Sections -->
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              href="https://www.github.com/"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <svg
                width="20px"
                height="20px"
                class="material-icons me-2 opacity-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
                data-testid="GitHubIcon"
                :fill="props.transparent && '#fff'"
              >
                <path
                  d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
                ></path>
              </svg>
              Github
            </a>
          </li>
          <!-- Sections -->
        </ul>
        <!-- 로그인 버튼 -->
       
        <div v-if="!isAuthenticated" class="auth-buttons">
          <button @click="login" class="nav-link action-button">Login</button>
        </div>
        <div v-else class="auth-buttons">
          <button @click="handleLogout" class="nav-link action-button">Logout</button>
        </div>
        
        
        <!-- 로그인 버튼 끝 -->
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<style>
.login-button-container {
  margin-top : 16px;
  margin-left: 8px;
}
.nav-link, .action-button {
    color: #003a9a; /* 버튼 색상 */
    text-decoration: none;
    font-weight: bold;
    background: none; /* 배경 제거 */
    border: none; /* 테두리 제거 */
    cursor: pointer;
    padding: 0;
  }
  
  .nav-link:hover, .action-button:hover {
    text-decoration: underline;
  }
  
  .auth-buttons {
    display: flex;
    align-items: center;
  }
  
  .username {
    font-weight: bold;
    color: #003a9a;
  }
  .dropdown-menu {
  display: none; /* 기본적으로 숨김 */
  position: absolute;
  background-color: #fff; /* 드롭다운 배경색 */
  border: 1px solid #ddd; /* 드롭다운 테두리 */
  z-index: 1000; /* 다른 요소 위에 표시되도록 */
}

.dropdown-menu.show {
  display: block; /* 열릴 때 표시 */
}
</style>