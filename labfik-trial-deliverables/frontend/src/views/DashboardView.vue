<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <div class="welcome">
          <h1>Welcome back, {{ firstName }}!</h1>
          <span>● LIVE SYSTEM</span>
        </div>
        <p>Berikut ringkasan kondisi Laboratorium FIK hari ini.</p>
      </div>
      <div class="date-chip">{{ today }}</div>
    </header>

    <div v-if="error" class="alert danger">{{ error }}</div>

    <section class="stats-grid six">
      <StatCard
        v-for="(card, index) in cards"
        :key="card.label"
        v-bind="card"
        :value="values[index]"
      />
    </section>

    <section class="dashboard-grid">
      <DashboardOverview :categories="categories" :max="maxCategoryTotal" />
      <SystemHealth
        :scope="data?.cakupan_data === 'full' ? '100%' : 'Scope'"
        :total-assets="data?.kpi.total_aset || 0"
        :attention-count="attention.length"
      />
    </section>

    <section class="dashboard-grid bottom">
      <AttentionPanel :items="attention" />
      <QuickLinks :links="quickLinks" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { menuByRole, roleLabel } from "../config/menu";
import { StatCard } from "../components/ui";
import AttentionPanel from "../components/dashboard/AttentionPanel.vue";
import DashboardOverview from "../components/dashboard/DashboardOverview.vue";
import QuickLinks from "../components/dashboard/QuickLinks.vue";
import SystemHealth from "../components/dashboard/SystemHealth.vue";
import { useDashboard } from "../composables/useDashboard";

const auth = useAuthStore();
const { data, error, categories, maxCategoryTotal, attention, values } =
  useDashboard();

const cards = [
  {
    label: "Total aset",
    hint: "Terdata di sistem",
    icon: "□",
    tone: "featured",
  },
  { label: "Kalibrasi overdue", hint: "Melewati jadwal", icon: "⌖" },
  { label: "Akan jatuh tempo", hint: "Perlu dijadwalkan", icon: "◷" },
  { label: "Temuan opname", hint: "Belum ditindaklanjuti", icon: "☷" },
  { label: "Work order aktif", hint: "Dalam penanganan", icon: "⌁" },
  { label: "Sertifikat vendor", hint: "Akan kedaluwarsa", icon: "◇" },
];

const firstName = computed(
  () => auth.user?.nama?.split(" ")[0] || roleLabel[auth.user!.role],
);
const quickLinks = computed(() =>
  auth.user
    ? menuByRole[auth.user.role].filter((item) => item.path !== "/dashboard")
    : [],
);
const today = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());
</script>
