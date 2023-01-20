import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//import * as dotenv from "dotenv";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

const pinia = createPinia();
const app = createApp(App);
//dotenv.config();

console.log(import.meta.env.VITE_API_GOOGLE_MAPS_KEY);

app.use(pinia);
app.use(router);
app.use(Antd).mount("#app");

// app.mount("#app");
