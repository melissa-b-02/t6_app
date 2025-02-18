<template>
  <div class="register-container">
    <h1>Registrieren</h1>
    <form @submit.prevent="register">
      <input
        v-model="username"
        type="text"
        placeholder="Benutzername"
        required
      />
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input
        v-model="password"
        type="password"
        placeholder="Passwort"
        required
      />
      <button class="btn btn-success">Konto erstellen</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <router-link to="/login">Bereits registriert? Einloggen</router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("Registrierung erfolgreich!", userCredential.user);
    router.push("/login");
  } catch (error) {
    console.error("Registrierung fehlgeschlagen:", error.message);
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.register-container {
  text-align: center;
  padding: 50px;
}

input {
  display: block;
  width: 80%;
  margin: 10px auto;
  padding: 10px;
}

button {
  width: 80%;
  padding: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
