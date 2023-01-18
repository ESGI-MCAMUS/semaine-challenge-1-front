import Antd from "ant-design-vue";
import axios from "axios";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";
import { API_URL } from "./environements";

const pinia = createPinia();
const app = createApp(App);

axios.defaults.baseURL = API_URL;

app.use(pinia);
app.use(router);
app.use(Antd).mount("#app");

// app.mount("#app");
