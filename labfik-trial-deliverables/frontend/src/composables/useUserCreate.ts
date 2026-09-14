import { computed, reactive, ref } from "vue";
import { usersApi } from "../api";
import { errorMessage } from "../api/client";
import type { Role } from "../types";

export function useUserCreate() {
  const form = reactive({
    nama: "",
    email: "",
    password: "",
    role: "laboran" as Role,
  });
  const confirmPassword = ref("");
  const busy = ref(false);
  const error = ref("");
  const success = ref("");

  const strength = computed(() =>
    form.password.length >= 12
      ? "Kuat"
      : form.password.length >= 8
        ? "Cukup"
        : "Lemah",
  );
  const canSubmit = computed(() =>
    Boolean(
      form.nama &&
      form.email &&
      form.password &&
      form.password === confirmPassword.value,
    ),
  );

  function reset() {
    Object.assign(form, {
      nama: "",
      email: "",
      password: "",
      role: "laboran" as Role,
    });
    confirmPassword.value = "";
    error.value = "";
  }

  async function save() {
    error.value = "";
    success.value = "";
    if (form.password !== confirmPassword.value) {
      error.value = "Konfirmasi password tidak sama.";
      return;
    }

    busy.value = true;
    try {
      const user = await usersApi.create({ ...form });
      success.value = user.email;
      reset();
    } catch (cause) {
      error.value = errorMessage(cause, "Akun gagal dibuat.");
    } finally {
      busy.value = false;
    }
  }

  return {
    form,
    confirmPassword,
    busy,
    error,
    success,
    strength,
    canSubmit,
    reset,
    save,
  };
}
