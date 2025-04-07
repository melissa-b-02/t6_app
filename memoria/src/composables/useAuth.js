import { ref, onMounted } from "vue";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const user = ref(null);
const username = ref(""); //  Benutzername speichern

export function useAuth() {
  const router = useRouter();

  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      username.value = currentUser?.displayName || "";
    });
  });

  const logout = async () => {
    await signOut(auth);
    user.value = null;
    username.value = ""; // Benutzernamen zurücksetzen
    router.push("/");
  };

  return { user, username, logout };
}
