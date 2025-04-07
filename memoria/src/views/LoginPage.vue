<template>
  <div class="auth-form text-center">
    <h1 class="log-reg">Anmelden</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input
        v-model="password"
        type="password"
        placeholder="Passwort"
        required
      />

      <button class="btn" :disabled="isLocked">
        {{ isLocked ? `Gesperrt (${lockTimer}s)` : "Login" }}
      </button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <router-link to="/register">Noch kein Konto? Hier registrieren</router-link>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const username = ref("");

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 30;

const attempts = ref(0);
const isLocked = ref(false);
const lockTimer = ref(0);
let lockInterval = null;

const restoreLockState = () => {
  const lockUntil = localStorage.getItem("lockUntil");
  const savedAttempts = localStorage.getItem("loginAttempts");

  if (savedAttempts) attempts.value = parseInt(savedAttempts);

  if (lockUntil) {
    const remaining = Math.floor((parseInt(lockUntil) - Date.now()) / 1000);
    if (remaining > 0) {
      isLocked.value = true;
      lockTimer.value = remaining;
      startLockCountdown(remaining);
    } else {
      localStorage.removeItem("lockUntil");
      localStorage.removeItem("loginAttempts");
    }
  }
};

const startLockCountdown = (duration) => {
  isLocked.value = true;
  lockTimer.value = duration;
  lockInterval = setInterval(() => {
    lockTimer.value--;
    if (lockTimer.value <= 0) {
      clearInterval(lockInterval);
      isLocked.value = false;
      attempts.value = 0;
      localStorage.removeItem("lockUntil");
      localStorage.removeItem("loginAttempts");
    }
  }, 1000);
};

onMounted(restoreLockState);

watchEffect(() => {
  if (user.value) {
    username.value = user.value.displayName || "Gast";
  }
});

if (user.value) {
  router.push("/dashboard");
}

const login = async () => {
  if (isLocked.value) return;

  // ✅ Neue Zeile: Prüfe ob offline
  if (!navigator.onLine) {
    errorMessage.value = "Du bist offline. Anmeldung ist nicht möglich.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    localStorage.removeItem("loginAttempts");
    router.push("/dashboard");
  } catch (error) {
    attempts.value++;
    localStorage.setItem("loginAttempts", attempts.value.toString());

    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Bitte gib eine gültige E-Mail-Adresse ein.";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage.value = "E-Mail oder Passwort ist falsch.";
        break;
      case "auth/too-many-requests":
        errorMessage.value =
          "Zu viele Fehlversuche. Bitte später erneut versuchen.";
        break;
      default:
        errorMessage.value =
          "Anmeldung fehlgeschlagen. Bitte erneut versuchen.";
    }

    if (attempts.value >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCK_DURATION * 1000;
      localStorage.setItem("lockUntil", lockUntil.toString());
      errorMessage.value = `Zu viele Fehlversuche. ${LOCK_DURATION} Sekunden Sperre.`;
      startLockCountdown(LOCK_DURATION);
    }
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
