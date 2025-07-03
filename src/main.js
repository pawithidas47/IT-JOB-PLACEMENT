// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);

// ✅ วิธีที่ถูกต้องใน Vue 3
app.config.globalProperties.$axios = axios;

app.use(router).mount("#app");
