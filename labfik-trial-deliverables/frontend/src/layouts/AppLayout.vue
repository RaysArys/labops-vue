<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ open: mobileOpen }">
      <div class="brand">
        <img src="/logo192.png" alt="UPNVJ" />
        <div><strong>LabOps FIK</strong><span>UPN VETERAN JAKARTA</span></div>
        <button class="icon-btn mobile-only" @click="mobileOpen = false">
          ×
        </button>
      </div>
      <div class="menu-label">MENU UTAMA</div>
      <nav>
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          @click="mobileOpen = false"
          ><i>{{ item.icon }}</i
          ><span>{{ item.label }}</span></RouterLink
        >
      </nav>
      <div class="sidebar-foot">
        <div class="avatar">{{ initials }}</div>
        <div>
          <strong>{{ auth.user?.nama || roleName }}</strong
          ><span>{{ roleName }}</span>
        </div>
        <button class="icon-btn" title="Keluar" @click="auth.logout()">
          ↪
        </button>
      </div>
    </aside>
    <div
      v-if="mobileOpen"
      class="sidebar-backdrop"
      @click="mobileOpen = false"
    />
    <main class="main-shell">
      <header class="topbar">
        <button class="icon-btn mobile-only" @click="mobileOpen = true">
          ☰
        </button>
        <div>
          <span class="crumb">LabOps FIK /</span><strong>{{ title }}</strong>
        </div>
        <div class="top-actions">
          <span class="live"><i /> LIVE SYSTEM</span
          ><button class="icon-btn">♧</button>
          <div class="top-user">
            <span class="avatar small">{{ initials }}</span>
            <div>
              <strong>{{ auth.user?.nama || roleName }}</strong
              ><span>{{ auth.user?.email }}</span>
            </div>
          </div>
        </div>
      </header>
      <section class="page-wrap"><RouterView /></section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { menuByRole, roleLabel } from "../config/menu";
const auth = useAuthStore(),
  route = useRoute(),
  mobileOpen = ref(false);
const menu = computed(() => (auth.user ? menuByRole[auth.user.role] : [])),
  roleName = computed(() =>
    auth.user ? roleLabel[auth.user.role] : "Pengguna",
  );
const initials = computed(() => {
  const n = auth.user?.nama || roleName.value;
  return n
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
});
const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/assets":
    auth.user?.role === "wakil_dekan" ? "Persetujuan aset" : "Master aset",
  "/work-orders":
    auth.user?.role === "wakil_dekan" ? "Laporan kerusakan" : "Work order",
  "/stock-opname": "Stock opname",
  "/calibration": "Kalibrasi",
  "/vendors": "Vendor",
  "/users": "Pengguna",
};
const title = computed(() => titles[route.path] || "LabOps FIK");
</script>
