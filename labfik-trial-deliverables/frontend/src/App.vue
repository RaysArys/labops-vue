<template>
  <div v-if="auth.loading" class="boot-screen">
    <img src="/logo192.png" alt="UPNVJ" />
    <div class="spinner" />
    <span>Menyiapkan LabOps FIK…</span>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
</script>
