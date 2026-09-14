<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">MITRA & AKREDITASI</span>
        <h1>Vendor</h1>
        <p>
          Kelola perusahaan penyedia layanan serta masa berlaku akreditasinya.
        </p>
      </div>
      <button class="btn primary" @click="openCreate">＋ Tambah vendor</button>
    </header>
    <div v-if="notice" class="alert success">
      {{ notice }}<button @click="notice = ''">×</button>
    </div>
    <div v-if="error" class="alert danger">
      {{ error }}<button @click="error = ''">×</button>
    </div>
    <section class="stats-grid">
      <StatCard
        label="Total vendor"
        :value="vendors.length"
        hint="Seluruh mitra"
        icon="◇"
      /><StatCard
        label="Aktif"
        :value="count('aktif')"
        hint="Akreditasi berlaku"
        icon="✓"
      /><StatCard
        label="Akan expired"
        :value="count('akan_expired')"
        hint="Perlu diperbarui"
        icon="◷"
      /><StatCard
        label="Expired"
        :value="count('expired')"
        hint="Tidak berlaku"
        icon="!"
        tone="danger"
      />
    </section>
    <section class="panel">
      <div class="toolbar">
        <label class="search"
          >⌕<input
            v-model="query"
            placeholder="Cari nama, kontak, atau akreditasi…" /></label
        ><select v-model="status">
          <option value="all">Semua status</option>
          <option v-for="(v, k) in statusLabel" :key="k" :value="k">
            {{ v }}
          </option></select
        ><button class="btn ghost" @click="load">↻</button>
      </div>
      <div class="result-line">
        Menampilkan <b>{{ filtered.length }}</b> dari
        {{ vendors.length }} vendor
      </div>
      <div v-if="loading" class="loading-block">
        <div />
        <div />
        <div />
      </div>
      <EmptyState
        v-else-if="!filtered.length"
        title="Vendor tidak ditemukan"
        text="Tambahkan vendor atau ubah pencarian."
      />
      <div v-else class="vendor-grid">
        <article v-for="v in filtered" :key="v.vendor_id" class="vendor-card">
          <div class="vendor-top">
            <span class="vendor-icon">◇</span
            ><StatusBadge
              :text="statusLabel[v.status_akreditasi]"
              :tone="tone(v.status_akreditasi)"
            />
          </div>
          <h3>{{ v.nama_vendor }}</h3>
          <p>{{ v.kontak || "Kontak belum dicatat" }}</p>
          <div class="vendor-info">
            <span
              >No. akreditasi <b>{{ v.no_akreditasi || "—" }}</b></span
            ><span
              >Berlaku sampai
              <b>{{
                v.tanggal_expired_akreditasi
                  ? date(v.tanggal_expired_akreditasi)
                  : "—"
              }}</b></span
            >
          </div>
          <div class="row-actions">
            <button class="btn tiny ghost" @click="edit(v)">Edit</button
            ><button class="btn tiny ghost" @click="refresh(v)">
              ↻ Status
            </button>
          </div>
        </article>
      </div>
    </section>
    <Modal
      v-if="modal"
      :title="editing ? 'Edit vendor' : 'Tambah vendor'"
      subtitle="Lengkapi identitas dan dokumen akreditasi."
      @close="modal = false"
      ><form @submit.prevent="save">
        <label>Nama vendor *<input v-model="form.nama" required /></label
        ><label
          >Kontak<input
            v-model="form.kontak"
            placeholder="Email atau telepon" /></label
        ><label>Nomor akreditasi<input v-model="form.nomor" /></label
        ><label
          >Tanggal kedaluwarsa<input v-model="form.expired" type="date"
        /></label>
        <div class="modal-actions">
          <button type="button" class="btn ghost" @click="modal = false">
            Batal</button
          ><button class="btn primary" :disabled="busy">
            {{ busy ? "Menyimpan…" : "Simpan vendor" }}
          </button>
        </div>
      </form></Modal
    >
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { vendorsApi } from "../api";
import { errorMessage } from "../api/client";
import type { Vendor, VendorAccreditationStatus } from "../types";
import { StatCard, StatusBadge, EmptyState, Modal } from "../components/ui";
const statusLabel: Record<VendorAccreditationStatus, string> = {
  aktif: "Aktif",
  akan_expired: "Akan expired",
  expired: "Expired",
};
const vendors = ref<Vendor[]>([]),
  loading = ref(true),
  busy = ref(false),
  error = ref(""),
  notice = ref(""),
  query = ref(""),
  status = ref<"all" | VendorAccreditationStatus>("all"),
  modal = ref(false),
  editing = ref<Vendor | null>(null),
  form = reactive({ nama: "", kontak: "", nomor: "", expired: "" });
const filtered = computed(() =>
    vendors.value.filter(
      (v) =>
        (status.value === "all" || v.status_akreditasi === status.value) &&
        (!query.value ||
          [v.nama_vendor, v.kontak, v.no_akreditasi]
            .join(" ")
            .toLowerCase()
            .includes(query.value.toLowerCase())),
    ),
  ),
  count = (s: VendorAccreditationStatus) =>
    vendors.value.filter((x) => x.status_akreditasi === s).length;
async function load() {
  loading.value = true;
  try {
    vendors.value = await vendorsApi.list();
  } catch (e) {
    error.value = errorMessage(e, "Vendor gagal dimuat.");
  } finally {
    loading.value = false;
  }
}
function openCreate() {
  editing.value = null;
  Object.assign(form, { nama: "", kontak: "", nomor: "", expired: "" });
  modal.value = true;
}
function edit(v: Vendor) {
  editing.value = v;
  Object.assign(form, {
    nama: v.nama_vendor,
    kontak: v.kontak || "",
    nomor: v.no_akreditasi || "",
    expired: v.tanggal_expired_akreditasi || "",
  });
  modal.value = true;
}
function payload() {
  return {
    nama_vendor: form.nama,
    ...(form.kontak ? { kontak: form.kontak } : {}),
    ...(form.nomor ? { no_akreditasi: form.nomor } : {}),
    ...(form.expired ? { tanggal_expired_akreditasi: form.expired } : {}),
  };
}
async function save() {
  busy.value = true;
  try {
    let v = editing.value
      ? await vendorsApi.update(editing.value.vendor_id, payload())
      : await vendorsApi.create(payload());
    v = await vendorsApi.refresh(v.vendor_id);
    vendors.value = editing.value
      ? vendors.value.map((x) => (x.vendor_id === v.vendor_id ? v : x))
      : [v, ...vendors.value];
    modal.value = false;
    notice.value = "Vendor berhasil disimpan.";
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    busy.value = false;
  }
}
async function refresh(v: Vendor) {
  try {
    const u = await vendorsApi.refresh(v.vendor_id);
    vendors.value = vendors.value.map((x) =>
      x.vendor_id === u.vendor_id ? u : x,
    );
    notice.value = "Status akreditasi diperbarui.";
  } catch (e) {
    error.value = errorMessage(e);
  }
}
const date = (v: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(v)),
  tone = (s: VendorAccreditationStatus) =>
    s === "aktif" ? "success" : s === "akan_expired" ? "warning" : "danger";
onMounted(load);
</script>
