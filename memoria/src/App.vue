<template>
  <div id="app">
    <!-- Header nur auf Login/Register -->
    <HeaderApp v-if="showHeader" />

    <!-- Seiteninhalt -->
    <router-view />

    <!-- Footer wird auf bestimmten Seiten versteckt -->
    <FooterApp v-if="!hideFooter" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import HeaderApp from "@/components/HeaderApp.vue";
import FooterApp from "@/components/FooterApp.vue";

const route = useRoute();

// Footer ausblenden auf: Login, Register, WelcomePage ("/")
const hideFooter = computed(() => {
  return (
    route.path === "/login" || route.path === "/register" || route.path === "/"
  );
});

// Header nur auf Login und Register anzeigen (nicht auf WelcomePage)
const showHeader = computed(() => {
  return route.path === "/login" || route.path === "/register";
});
</script>

<style>
/* Falls du zusätzliches Styling brauchst */
</style>
