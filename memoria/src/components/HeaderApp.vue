<script setup>
import { useAuth } from "@/composables/useAuth";

const { user, username, logout } = useAuth(); // 🔥 username aus useAuth abrufen
</script>

<template>
  <header class="header">
    <h1>Memoria</h1>
    <div v-if="user">
      <p>Hallo, {{ username }}</p>
      <button @click="logout">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #b20b13;
  color: white;
  padding: 10px;
  text-align: center;
}
</style>
