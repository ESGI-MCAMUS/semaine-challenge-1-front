import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGeolocation from "vuejs3-google-maps"
import GMaps from "vuejs3-google-maps";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";
import { API_URL, API_GOOGLE_MAP_KEY } from "./environements";

const pinia = createPinia();
const app = createApp(App);

axios.defaults.baseURL = API_URL;

app.use(GMaps, {
    load: {
        apiKey: API_GOOGLE_MAP_KEY,
    },
});
app.use(pinia);
app.use(router);
app.use(Antd).mount("#app");

// app.mount("#app");
