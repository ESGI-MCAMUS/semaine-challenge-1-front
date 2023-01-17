import Antd from "ant-design-vue";
import axios from "axios";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

const app = createApp(App);

axios.defaults.baseURL = "https://localhost";

app.use(router);
app.use(Antd).mount("#app");

// app.mount("#app");
