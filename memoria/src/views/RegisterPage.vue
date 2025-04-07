<template>
  <div class="auth-form text-center">
    <h1 class="log-reg">Registrieren</h1>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="E-Mail" required />

      <input
        v-model="password"
        type="password"
        placeholder="Passwort"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Passwort wiederholen"
        required
      />

      <p v-if="passwordMismatch" class="error">
        Die Passwörter stimmen nicht überein!
      </p>

      <button class="btn" :disabled="passwordMismatch">Konto erstellen</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <router-link to="/login">Bereits registriert? Einloggen</router-link>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const router = useRouter();

// Prüft, ob die Passwörter übereinstimmen
const passwordMismatch = computed(
  () => password.value !== confirmPassword.value
);

const register = async () => {
  if (passwordMismatch.value) {
    errorMessage.value = "Die Passwörter stimmen nicht überein!";
    return;
  }
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
.auth-form {
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background: #b20b13;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  background: #8f0a0f;
}

.error {
  color: red;
  font-size: 0.9rem;
}
</style>
