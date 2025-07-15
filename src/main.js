// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const app = createApp(App);

// ✅ เพิ่ม global axios
app.config.globalProperties.$axios = axios;

// ✅ ใช้งาน BootstrapVue 3
app.use(BootstrapVue3);

app.use(router).mount("#app");
