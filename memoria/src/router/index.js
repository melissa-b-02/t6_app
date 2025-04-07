import * as VueRouter from "vue-router"; // Importiere Vue Router als Namespace
import WelcomePage from "@/views/WelcomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import ImageUpload from "@/views/ImageUpload.vue";
import PhotoGallery from "@/views/PhotoGallery.vue";
import ImageInfo from "@/views/ImageInfo.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
  { path: "/", component: WelcomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/dashboard", component: DashboardPage },
  { path: "/upload", component: ImageUpload },
  { path: "/gallery", component: PhotoGallery },
  {
    path: "/image-info",
    name: "ImageInfo",
    component: ImageInfo,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const publicPages = ["/", "/login", "/register"];
  const requiresAuth = !publicPages.includes(to.path);

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next("/login");
    } else {
      next();
    }
  });
});

export default router;
