import { ref } from "vue";
import { useRouter } from "vue-router";
import { errorMessage } from "../api/client";
import { useAuthStore } from "../stores/auth";

export function useLogin() {
  const auth = useAuthStore();
  const router = useRouter();
  const email = ref("");
  const password = ref("");
  const busy = ref(false);
  const error = ref("");

  async function submit() {
    busy.value = true;
    error.value = "";
    try {
      await auth.login(email.value, password.value);
      await router.push("/dashboard");
    } catch (cause) {
      error.value = errorMessage(cause, "Email atau kata sandi salah.");
    } finally {
      busy.value = false;
    }
  }

  async function sso() {
    busy.value = true;
    error.value = "";
    try {
      await auth.loginSso();
    } catch (cause) {
      error.value = errorMessage(cause, "Keycloak tidak dapat dibuka.");
      busy.value = false;
    }
  }

  return { auth, email, password, busy, error, submit, sso };
}
