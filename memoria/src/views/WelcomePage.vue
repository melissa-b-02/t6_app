<template>
  <div class="welcome-container">
    <h1>Willkommen bei</h1>
    <img
      src="../assets/memoria_logo.png"
      alt="Logo von Memoria"
      class="align-content-center"
    />

    <router-link to="/login" class="btn col-12"> Login </router-link>

    <router-link to="/register" class="btn btn-secondary col-12">
      Registrieren
    </router-link>
  </div>
</template>

<style scoped>
.welcome-container {
  text-align: center;
  padding: 50px;
}
img {
  width: 100%;
  padding: -1rem;
}
@media (min-width: 768px) {
  img {
    max-width: 15%;
    margin: 0 auto;
    padding-bottom: 15px;
  }
}
</style>
