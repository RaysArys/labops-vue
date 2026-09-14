<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">{{
          isWadek ? "GOVERNANCE ASET" : "INVENTORY LABORATORIUM"
        }}</span>
        <h1>{{ isWadek ? "Persetujuan aset" : "Master aset" }}</h1>
        <p>
          {{
            isWadek
              ? "Tinjau pengajuan sebelum aset diaktifkan."
              : "Kelola identitas, lokasi, dan status aset laboratorium."
          }}
        </p>
      </div>
      <button v-if="isTU" class="btn primary" @click="openCreate">
        ＋ Tambah aset
      </button>
    </header>
    <div v-if="notice" class="alert success">
      {{ notice }}<button @click="notice = ''">×</button>
    </div>
    <div v-if="error" class="alert danger">
      {{ error }}<button @click="error = ''">×</button>
    </div>
    <section class="stats-grid">
      <StatCard
        label="Total aset"
        :value="assets.length"
        hint="Seluruh data"
        icon="□"
      /><StatCard
        label="Disetujui"
        :value="count('approved')"
        hint="Aset aktif"
        icon="✓"
      /><StatCard
        label="Menunggu"
        :value="count('pending_approval')"
        hint="Perlu persetujuan"
        icon="◷"
      /><StatCard
        label="Draft"
        :value="count('draft')"
        hint="Belum diajukan"
        icon="✎"
      />
    </section>
    <section class="panel">
      <div class="toolbar">
        <label class="search"
          >⌕<input
            v-model="query"
            placeholder="Cari nama, inventaris, serial, merek…" /></label
        ><select v-model="category">
          <option value="all">Semua kategori</option>
          <option v-for="(v, k) in categories" :key="k" :value="k">
            {{ v }}
          </option></select
        ><select v-model="approval">
          <option value="all">Semua status</option>
          <option v-for="(v, k) in approvals" :key="k" :value="k">
            {{ v }}
          </option></select
        ><button class="btn ghost" @click="load">↻</button>
      </div>
      <div class="result-line">
        Menampilkan <b>{{ filtered.length }}</b> dari {{ assets.length }} aset
      </div>
      <div v-if="loading" class="loading-block">
        <div />
        <div />
        <div />
      </div>
      <EmptyState
        v-else-if="!filtered.length"
        title="Aset tidak ditemukan"
        text="Tambahkan aset atau ubah filter yang digunakan."
      />
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Aset</th>
              <th>Kategori</th>
              <th>Lokasi</th>
              <th>Kondisi</th>
              <th>Persetujuan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="asset in filtered" :key="asset.asset_id">
              <td>
                <div class="asset-cell">
                  <span>□</span>
                  <div>
                    <strong>{{ asset.nama_aset }}</strong
                    ><small>{{
                      asset.no_inventaris ||
                      asset.serial_number ||
                      short(asset.asset_id)
                    }}</small>
                  </div>
                </div>
              </td>
              <td>{{ categories[asset.kategori] }}</td>
              <td>{{ location(asset) }}</td>
              <td>
                <StatusBadge
                  :text="asset.kondisi.replaceAll('_', ' ')"
                  :tone="asset.kondisi === 'rusak' ? 'danger' : 'success'"
                />
              </td>
              <td>
                <StatusBadge
                  :text="approvals[asset.status_approval]"
                  :tone="approvalTone(asset.status_approval)"
                />
              </td>
              <td>
                <div class="row-actions">
                  <button class="btn tiny ghost" @click="selected = asset">
                    Detail</button
                  ><button
                    v-if="
                      isTU &&
                      ['draft', 'rejected'].includes(asset.status_approval)
                    "
                    class="btn tiny ghost"
                    @click="openEdit(asset)"
                  >
                    Edit</button
                  ><button
                    v-if="isTU && asset.status_approval === 'draft'"
                    class="btn tiny primary"
                    @click="act(asset, 'ajukan')"
                  >
                    Ajukan</button
                  ><template
                    v-if="
                      isWadek && asset.status_approval === 'pending_approval'
                    "
                    ><button class="btn tiny danger" @click="askReject(asset)">
                      Tolak</button
                    ><button
                      class="btn tiny primary"
                      @click="act(asset, 'setujui')"
                    >
                      Setujui
                    </button></template
                  ><button
                    v-if="isTU && asset.status_approval === 'rejected'"
                    class="btn tiny primary"
                    @click="act(asset, 'revisi')"
                  >
                    Revisi
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <Modal
      v-if="selected"
      title="Detail aset"
      :subtitle="selected.no_inventaris || short(selected.asset_id)"
      wide
      @close="selected = null"
      ><div class="detail-grid">
        <div v-for="item in details(selected)" :key="String(item[0])">
          <span>{{ item[0] }}</span
          ><strong>{{ item[1] || "—" }}</strong>
        </div>
      </div>
      <div
        v-if="Object.keys(selected.atribut_kategori || {}).length"
        class="attribute-box"
      >
        <h3>Atribut kategori</h3>
        <div v-for="(v, k) in selected.atribut_kategori" :key="String(k)">
          <span>{{ String(k).replaceAll("_", " ") }}</span
          ><b>{{ v }}</b>
        </div>
      </div></Modal
    >
    <Modal
      v-if="formOpen"
      :title="editing ? 'Edit aset' : 'Tambah aset'"
      subtitle="Isi identitas dan lokasi aset."
      wide
      @close="formOpen = false"
      ><form @submit.prevent="save">
        <div class="form-grid">
          <label class="span-2"
            >Nama aset *<input v-model="form.nama_aset" required /></label
          ><label
            >Kategori *<select v-model="form.kategori">
              <option v-for="(v, k) in categories" :value="k" :key="k">
                {{ v }}
              </option>
            </select></label
          ><label>Subkategori<input v-model="form.subkategori" /></label
          ><label>Merek<input v-model="form.merek" /></label
          ><label>Model<input v-model="form.model" /></label
          ><label>Serial number<input v-model="form.serial_number" /></label
          ><label>No. inventaris<input v-model="form.no_inventaris" /></label
          ><label
            >Tahun perolehan<input
              v-model.number="form.tahun_perolehan"
              type="number"
              min="1900" /></label
          ><label
            >Jumlah<input
              v-model.number="form.qty_sistem"
              type="number"
              min="0"
              step="0.01" /></label
          ><label>Satuan<input v-model="form.satuan" /></label
          ><label>Gedung<input v-model="form.gedung" /></label
          ><label>Lantai<input v-model="form.lantai" /></label
          ><label>Ruangan<input v-model="form.ruangan" /></label
          ><label>Rak<input v-model="form.rak" /></label
          ><label>PIC pengguna<input v-model="form.pic_pengguna" /></label
          ><label>Unit pemilik<input v-model="form.unit_pemilik" /></label>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn ghost" @click="formOpen = false">
            Batal</button
          ><button class="btn primary" :disabled="busy">
            {{ busy ? "Menyimpan…" : "Simpan aset" }}
          </button>
        </div>
      </form></Modal
    >
    <Modal
      v-if="rejecting"
      title="Tolak pengajuan?"
      subtitle="Berikan alasan agar Tata Usaha dapat merevisi."
      @close="rejecting = null"
      ><label
        >Alasan penolakan *<textarea v-model="reason" rows="4" required />
      </label>
      <div class="modal-actions">
        <button class="btn ghost" @click="rejecting = null">Batal</button
        ><button
          class="btn danger"
          :disabled="!reason.trim() || busy"
          @click="act(rejecting!, 'tolak', reason)"
        >
          Tolak aset
        </button>
      </div></Modal
    >
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { assetsApi } from "../api";
import { errorMessage } from "../api/client";
import { useAuthStore } from "../stores/auth";
import type {
  ApprovalAction,
  ApprovalStatus,
  Asset,
  AssetKategori,
  AssetPayload,
} from "../types";
import { StatCard, StatusBadge, EmptyState, Modal } from "../components/ui";
const auth = useAuthStore(),
  isTU = auth.user?.role === "tata_usaha",
  isWadek = auth.user?.role === "wakil_dekan";
const categories: Record<AssetKategori, string> = {
    alat_ukur: "Alat ukur",
    jaringan: "Jaringan",
    server_pc: "Server & PC",
    iot_embedded: "IoT & Embedded",
    kelistrikan_ups: "Kelistrikan & UPS",
    audio_visual: "Audio visual",
    sparepart_bhp: "Sparepart & BHP",
  },
  approvals: Record<ApprovalStatus, string> = {
    draft: "Draft",
    pending_approval: "Menunggu persetujuan",
    approved: "Disetujui",
    rejected: "Ditolak",
  };
const assets = ref<Asset[]>([]),
  loading = ref(true),
  busy = ref(false),
  query = ref(""),
  category = ref<"all" | AssetKategori>("all"),
  approval = ref<"all" | ApprovalStatus>(isWadek ? "pending_approval" : "all"),
  error = ref(""),
  notice = ref(""),
  selected = ref<Asset | null>(null),
  formOpen = ref(false),
  editing = ref<Asset | null>(null),
  rejecting = ref<Asset | null>(null),
  reason = ref("");
const empty = () => ({
  nama_aset: "",
  kategori: "alat_ukur" as AssetKategori,
  subkategori: "",
  merek: "",
  model: "",
  serial_number: "",
  no_inventaris: "",
  tahun_perolehan: undefined as number | undefined,
  qty_sistem: 1,
  satuan: "unit",
  gedung: "",
  lantai: "",
  ruangan: "",
  rak: "",
  pic_pengguna: "",
  unit_pemilik: "FIK",
});
const form = reactive(empty());
const filtered = computed(() =>
  assets.value.filter(
    (a) =>
      (!query.value ||
        [a.nama_aset, a.no_inventaris, a.serial_number, a.merek, a.ruangan]
          .join(" ")
          .toLowerCase()
          .includes(query.value.toLowerCase())) &&
      (category.value === "all" || a.kategori === category.value) &&
      (approval.value === "all" || a.status_approval === approval.value),
  ),
);
const count = (s: ApprovalStatus) =>
    assets.value.filter((x) => x.status_approval === s).length,
  short = (id: string) => id.slice(0, 8).toUpperCase(),
  location = (a: Asset) =>
    [a.gedung, a.lantai, a.ruangan, a.rak].filter(Boolean).join(" · ") ||
    "Belum diatur";
const approvalTone = (s: ApprovalStatus) =>
  s === "approved"
    ? "success"
    : s === "pending_approval"
      ? "warning"
      : s === "rejected"
        ? "danger"
        : "neutral";
async function load() {
  loading.value = true;
  try {
    assets.value = await assetsApi.list();
  } catch (e) {
    error.value = errorMessage(e, "Data aset gagal dimuat.");
  } finally {
    loading.value = false;
  }
}
function openCreate() {
  editing.value = null;
  Object.assign(form, empty());
  formOpen.value = true;
}
function openEdit(a: Asset) {
  editing.value = a;
  Object.assign(form, {
    ...empty(),
    ...a,
    tahun_perolehan: a.tahun_perolehan ?? undefined,
  });
  formOpen.value = true;
}
function clean(): AssetPayload {
  const p: any = {};
  for (const [k, v] of Object.entries(form))
    if (v !== "" && v !== undefined) p[k] = v;
  return p;
}
async function save() {
  busy.value = true;
  try {
    const a = editing.value
      ? await assetsApi.update(editing.value.asset_id, clean())
      : await assetsApi.create(clean());
    assets.value = editing.value
      ? assets.value.map((x) => (x.asset_id === a.asset_id ? a : x))
      : [a, ...assets.value];
    notice.value = `Aset ${a.nama_aset} berhasil disimpan.`;
    formOpen.value = false;
  } catch (e) {
    error.value = errorMessage(e, "Aset gagal disimpan.");
  } finally {
    busy.value = false;
  }
}
async function act(a: Asset, action: ApprovalAction, alasan?: string) {
  busy.value = true;
  try {
    const u = await assetsApi.approval(a.asset_id, action, alasan);
    assets.value = assets.value.map((x) => (x.asset_id === u.asset_id ? u : x));
    notice.value = `Status ${a.nama_aset} berhasil diperbarui.`;
    rejecting.value = null;
    reason.value = "";
  } catch (e) {
    error.value = errorMessage(e, "Status aset gagal diperbarui.");
  } finally {
    busy.value = false;
  }
}
function askReject(a: Asset) {
  rejecting.value = a;
  reason.value = "";
}
const details = (a: Asset) => [
  ["Nama aset", a.nama_aset],
  ["Kategori", categories[a.kategori]],
  ["Merek / model", [a.merek, a.model].filter(Boolean).join(" ")],
  ["Serial number", a.serial_number],
  ["No. inventaris", a.no_inventaris],
  ["Lokasi", location(a)],
  ["Jumlah", `${a.qty_sistem} ${a.satuan || "unit"}`],
  ["Kondisi", a.kondisi],
  ["Status aset", a.status_aset],
  ["Persetujuan", approvals[a.status_approval]],
  ["PIC", a.pic_pengguna],
  ["Unit", a.unit_pemilik],
];
onMounted(load);
</script>
