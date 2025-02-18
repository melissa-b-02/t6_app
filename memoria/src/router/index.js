import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "@/views/WelcomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();
const routes = [
  { path: "/", component: WelcomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/dashboard", component: DashboardPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/dashboard" && !user.value) {
    next("/login"); // Falls nicht eingeloggt → zum Login weiterleiten
  } else {
    next(); // Seite normal laden
  }
});
export default router;
