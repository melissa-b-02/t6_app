<template>
  <div class="welcome-container">
    <h1>Willkommen bei</h1>
    <img
      src="../assets/memoria_logo.png"
      alt="Logo von Memoria"
      class="align-content-center"
    />
    <p>Dein persönliches Digitales Fotobuch</p>

    <div class="buttons">
      <router-link to="/login" class="btn btn-primary btn-lg col-12">
        Login
      </router-link>

      <router-link to="/register" class="btn btn-secondary btn-lg col-12">
        Registrieren
      </router-link>
    </div>
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
</style>
