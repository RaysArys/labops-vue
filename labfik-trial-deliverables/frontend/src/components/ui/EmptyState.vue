<template>
  <div class="empty-state">
    <div class="empty-icon">◇</div>
    <strong>{{ title }}</strong>
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  text?: string;
}>();
</script>
