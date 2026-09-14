<template>
  <span class="badge" :class="tone"><i />{{ text }}</span>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
  tone?: string;
}>();
</script>
