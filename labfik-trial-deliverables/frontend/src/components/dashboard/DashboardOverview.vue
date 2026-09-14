<template>
  <article class="panel chart-panel">
    <div class="panel-title">
      <div>
        <h2>Overview aset</h2>
        <p>Distribusi aset berdasarkan kategori</p>
      </div>
      <span class="chip">Semua aset</span>
    </div>
    <div v-if="categories.length" class="bars">
      <div v-for="item in categories" :key="item.label" class="bar">
        <strong>{{ item.total }}</strong>
        <div>
          <i
            :style="{ height: `${Math.max(12, (item.total / max) * 100)}%` }"
          />
        </div>
        <span>{{ formatLabel(item.label) }}</span>
      </div>
    </div>
    <EmptyState
      v-else
      title="Belum ada data"
      text="Distribusi aset akan muncul di sini."
    />
  </article>
</template>

<script setup lang="ts">
import EmptyState from "../ui/EmptyState.vue";

defineProps<{
  categories: Array<{ label: string; total: number }>;
  max: number;
}>();

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}
</script>
