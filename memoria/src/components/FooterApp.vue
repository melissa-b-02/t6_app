<template>
  <nav class="navbar fixed-bottom">
    <div class="container d-flex justify-content-around task-bar">
      <router-link
        to="/dashboard"
        class="nav-item"
        :class="{ active: route.path === '/dashboard' }"
      >
        <i class="bi bi-house fa-2x"></i>
      </router-link>
      <router-link
        to="/upload"
        class="nav-item"
        :class="{ active: route.path === '/upload' }"
      >
        <i class="bi bi-upload"></i>
      </router-link>
      <router-link
        to="/gallery"
        class="nav-item"
        :class="{ active: route.path === '/gallery' }"
      >
        <i class="bi bi-images"></i>
      </router-link>
      <button @click="logout" class="nav-item">
        <i class="bi bi-box-arrow-in-right"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Logout fehlgeschlagen:", error);
  }
};
</script>

<style scoped>
.task-bar {
  width: 90%;
  background-color: var(--main-bg-color);
  box-shadow: 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 5em;
  margin-bottom: 1.2em;
}

.nav-item {
  color: #000;
  background-color: var(--main-bg-color);
  padding: 10px 20px;
  margin: 10px auto;
  font-size: 16px;
  transition: 0.3s ease-in-out;
  border: none;
}

.nav-item.active {
  color: var(--main-color);
  border-radius: 10px;
  font-size: 18px;
}

.nav-item.active i {
  -webkit-text-stroke: 1px;
}

i {
  font-size: 1.2em;
}
</style>
