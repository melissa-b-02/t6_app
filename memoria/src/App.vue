<template>
  <div>
    <HeaderApp v-if="showHeaderFooter" />
    <div class="container mt-4">
      <router-view />
    </div>
    <FooterApp v-if="showHeaderFooter" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import HeaderApp from "@/components/HeaderApp.vue";
import FooterApp from "@/components/FooterApp.vue";

const route = useRoute();

// Header & Footer nur anzeigen, wenn NICHT auf der WelcomePage
const showHeaderFooter = computed(() => route.path !== "/");
</script>

<style>
body {
  margin-bottom: 60px; /* Falls Bottom Navigation verwendet wird */
}
</style>
