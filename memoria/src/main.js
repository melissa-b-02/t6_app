import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./registerServiceWorker";
import "@/assets/style.css";
import "./registerServiceWorker";

createApp(App).use(router).mount("#app");
