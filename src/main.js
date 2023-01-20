import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";
import { API_URL, API_GOOGLE_MAP_KEY } from "./environements";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Antd).mount("#app");

// app.mount("#app");
