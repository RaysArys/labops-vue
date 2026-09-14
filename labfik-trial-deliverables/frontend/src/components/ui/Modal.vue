<template>
  <div class="modal-backdrop" @mousedown="handleBackdropClick">
    <section class="modal-card" :class="{ wide }">
      <button class="modal-x" type="button" @click="$emit('close')">×</button>
      <div class="modal-head">
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot />
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
  subtitle?: string;
  wide?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) emit("close");
}
</script>
