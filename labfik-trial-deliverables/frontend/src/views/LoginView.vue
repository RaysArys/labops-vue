<template>
  <main class="login-page">
    <LoginBrandPanel />
    <LoginForm
      v-model:email="email"
      v-model:password="password"
      :mode="auth.mode"
      :busy="busy"
      :error="error"
      @submit="submit"
      @sso="sso"
    />
  </main>
</template>

<script setup lang="ts">
import LoginBrandPanel from "../components/auth/LoginBrandPanel.vue";
import LoginForm from "../components/auth/LoginForm.vue";
import { useLogin } from "../composables/useLogin";

const { auth, email, password, busy, error, submit, sso } = useLogin();
</script>
