<template>
  <HeaderApp v-if="showHeader" />
  <router-view />
  <FooterApp v-if="!hideFooter" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import HeaderApp from "@/components/HeaderApp.vue";
import FooterApp from "@/components/FooterApp.vue";

const route = useRoute();
const hideFooter = computed(() =>
  ["/login", "/register", "/"].includes(route.path)
);
const showHeader = computed(() => ["/login", "/register"].includes(route.path));
</script>
