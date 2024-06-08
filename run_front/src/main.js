// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // store 가져오기

// FontAwesome 아이콘 임포트
import '@fortawesome/fontawesome-free/css/all.css';

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";

const app = createApp(App);
app.use(router);
app.use(store); // store 사용
app.mount("#app");
app.use(materialKit);
