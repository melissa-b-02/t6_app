<template>
  <nav class="navbar fixed-bottom navbar-dark bg-dark">
    <div class="container d-flex justify-content-around">
      <router-link to="/" class="nav-item">
        <span>home</span>
        <i class="bi bi-house-door"></i>
      </router-link>
      <router-link to="/search" class="nav-item">
        <span>home</span>
        <i class="bi bi-search"></i>
      </router-link>
      <router-link to="/favorites" class="nav-item">
        <span>home</span>
        <i class="bi bi-heart"></i>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span>home</span>
        <i class="bi bi-person"></i>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
span {
  font-size: 1rem;
}
</style>
<script setup lang="ts"></script>
