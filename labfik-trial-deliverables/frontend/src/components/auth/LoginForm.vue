<template>
  <section class="login-form-side">
    <span class="trial-pill">● TRIAL ENVIRONMENT</span>
    <form class="login-card" @submit.prevent="$emit('submit')">
      <img src="/logo192.png" alt="UPNVJ" />
      <h2>Selamat datang!</h2>
      <p>Masuk untuk mengelola operasional laboratorium.</p>
      <div v-if="error" class="alert danger">{{ error }}</div>

      <template v-if="mode === 'local'">
        <label
          >Email address<input
            v-model="email"
            type="email"
            required
            placeholder="nama@labfik.local"
        /></label>
        <label
          >Kata sandi<input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
        /></label>
        <button class="btn primary full" :disabled="busy">
          {{ busy ? "Memeriksa…" : "Masuk ke dashboard" }} <span>→</span>
        </button>
      </template>
      <template v-else>
        <div class="sso-info">
          <strong>Single Sign-On UPNVJ</strong
          ><span>Gunakan akun Keycloak sesuai role lo.</span>
        </div>
        <button
          type="button"
          class="btn primary full"
          :disabled="busy"
          @click="$emit('sso')"
        >
          {{ busy ? "Mengalihkan…" : "Masuk dengan Keycloak" }} <span>→</span>
        </button>
      </template>
      <small>Gunakan akun yang diberikan administrator LabOps FIK.</small>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  mode: string;
  busy: boolean;
  error: string;
}>();

const email = defineModel<string>("email", { default: "" });
const password = defineModel<string>("password", { default: "" });

defineEmits<{
  submit: [];
  sso: [];
}>();

const mode = computed(() => props.mode);
</script>
