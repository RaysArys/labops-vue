<template>
  <aside class="panel period-panel">
    <div class="panel-title">
      <div>
        <h2>Periode opname</h2>
        <p>{{ periods.length }} periode</p>
      </div>
    </div>
    <div v-if="loading" class="loading-block">
      <div />
      <div />
    </div>
    <EmptyState
      v-else-if="!periods.length"
      title="Belum ada periode"
      text="Buka periode pertama untuk memulai."
    />
    <button
      v-for="period in periods"
      :key="period.periode_id"
      class="period-item"
      :class="{ active: selectedId === period.periode_id }"
      @click="$emit('select', period.periode_id)"
    >
      <span class="period-date">{{ formatDate(period.tanggal_mulai) }}</span>
      <StatusBadge
        :text="period.status === 'aktif' ? 'Aktif' : 'Selesai'"
        :tone="period.status === 'aktif' ? 'success' : 'neutral'"
      />
      <small>{{ period.cakupan_lokasi || "Semua lokasi" }}</small>
    </button>
  </aside>
</template>

<script setup lang="ts">
import EmptyState from "../ui/EmptyState.vue";
import StatusBadge from "../ui/StatusBadge.vue";
import type { StockOpnamePeriod } from "../../types";

defineProps<{
  periods: StockOpnamePeriod[];
  selectedId: string;
  loading: boolean;
  formatDate: (value: string) => string;
}>();
defineEmits<{ select: [id: string] }>();
</script>
