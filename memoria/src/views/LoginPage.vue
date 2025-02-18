<script setup>
import { ref, watchEffect } from "vue";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const username = ref(""); // 🔥 username wird jetzt verwendet!

// 🔥 Falls der User eingeloggt ist, Namen setzen
watchEffect(() => {
  if (user.value) {
    username.value = user.value.displayName || "Gast";
  }
});

if (user.value) {
  router.push("/dashboard"); // Falls User eingeloggt ist → Dashboard
}

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div class="login-container">
    <h1>Anmelden</h1>
    <p v-if="user">Willkommen, {{ username }}</p>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input
        v-model="password"
        type="password"
        placeholder="Passwort"
        required
      />
      <button class="btn btn-primary">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <router-link to="/register">Noch kein Konto? Registrieren</router-link>
  </div>
</template>
