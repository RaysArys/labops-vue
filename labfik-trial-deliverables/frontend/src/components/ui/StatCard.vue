<template>
  <article class="stat-card" :class="tone">
    <div class="stat-icon">{{ icon }}</div>
    <div class="stat-copy">
      <span>{{ label }}</span>
      <strong>{{ value ?? 0 }}</strong>
      <small>{{ hint }}</small>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  value?: string | number;
  hint?: string;
  tone?: string;
  icon?: string;
}>();
</script>
