// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // store 가져오기

const app = createApp(App);
app.use(router);
app.use(store); // store 사용
app.mount("#app");
