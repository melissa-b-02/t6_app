import { createApp } from "vue";
import App from "./App.vue";
import "../public/registerServiceWorker";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/registerServiceWorker";
import "@/assets/style.css";
import "../public/registerServiceWorker";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap-datepicker";
import "jquery";

createApp(App).use(router).mount("#app");
navigator.serviceWorker.register("/service-worker.js");
