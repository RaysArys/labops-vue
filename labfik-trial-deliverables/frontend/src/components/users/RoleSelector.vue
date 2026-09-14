<template>
  <div class="role-grid">
    <button
      v-for="role in roles"
      :key="role.value"
      type="button"
      :class="{ active: modelValue === role.value }"
      @click="$emit('update:modelValue', role.value)"
    >
      <span>{{ role.icon }}</span>
      <strong>{{ role.label }}</strong>
      <small>{{ role.desc }}</small>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Role } from "../../types";

export interface RoleOption {
  value: Role;
  label: string;
  icon: string;
  desc: string;
}

defineProps<{
  modelValue: Role;
  roles: RoleOption[];
}>();

defineEmits<{
  "update:modelValue": [value: Role];
}>();
</script>
