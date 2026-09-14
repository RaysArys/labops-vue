<template>
  <article class="panel">
    <div class="panel-title">
      <div>
        <h2>Perlu perhatian</h2>
        <p>Prioritas yang harus diperiksa</p>
      </div>
      <span class="badge warning">{{ items.length }} item</span>
    </div>
    <div v-if="items.length" class="attention-list">
      <div v-for="(item, index) in items" :key="index">
        <span>!</span>
        <div>
          <strong>{{
            item.nama_aset || item.nama_vendor || "Item perlu ditinjau"
          }}</strong>
          <small>{{ textValues(item).join(" · ") }}</small>
        </div>
      </div>
    </div>
    <EmptyState
      v-else
      title="Semua aman"
      text="Tidak ada item mendesak saat ini."
    />
  </article>
</template>

<script setup lang="ts">
import EmptyState from "../ui/EmptyState.vue";

defineProps<{
  items: Array<Record<string, unknown>>;
}>();

function textValues(item: Record<string, unknown>) {
  return Object.values(item)
    .filter((value): value is string => typeof value === "string")
    .slice(1, 3);
}
</script>
