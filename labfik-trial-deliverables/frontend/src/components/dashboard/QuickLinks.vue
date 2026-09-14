<template>
  <article class="panel">
    <div class="panel-title">
      <div>
        <h2>Akses cepat</h2>
        <p>Modul sesuai peran lo</p>
      </div>
    </div>
    <div class="quick-links">
      <RouterLink v-for="item in links" :key="item.path" :to="item.path">
        <span>{{ item.icon }}　{{ item.label }}</span
        ><b>→</b>
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  links: Array<{ path: string; icon: string; label: string }>;
}>();
</script>
