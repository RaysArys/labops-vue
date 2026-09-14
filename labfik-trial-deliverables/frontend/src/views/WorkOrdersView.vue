<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">{{
          isWadek ? "PELAPORAN KERUSAKAN" : "MAINTENANCE LABORATORIUM"
        }}</span>
        <h1>{{ isWadek ? "Laporan kerusakan" : "Work order" }}</h1>
        <p>{{ headingText }}</p>
      </div>
      <span class="live"
        ><i />
        {{
          isWadek
            ? `${tickets.length} laporan diterima`
            : `${active} tiket aktif`
        }}</span
      >
    </header>
    <div v-if="notice" class="alert success">
      {{ notice }}<button @click="notice = ''">×</button>
    </div>
    <div v-if="error" class="alert danger">
      {{ error }}<button @click="error = ''">×</button>
    </div>

    <section class="stats-grid five">
      <StatCard
        label="Tiket aktif"
        :value="active"
        hint="Perlu ditangani"
        icon="⌁"
      />
      <StatCard
        label="Terbuka"
        :value="countStatus('open')"
        hint="Belum dikerjakan"
        icon="□"
      />
      <StatCard
        label="Dikerjakan"
        :value="countStatus('in_progress')"
        hint="Sedang diproses"
        icon="↻"
      />
      <StatCard
        label="Kritis"
        :value="critical"
        hint="Prioritas tinggi"
        icon="!"
        tone="danger"
      />
      <StatCard
        label="Laporan ke Wadek"
        :value="sentReports"
        hint="Sudah ditandai dikirim"
        icon="⇧"
      />
    </section>

    <section class="panel">
      <div class="toolbar">
        <label class="search"
          >⌕<input
            v-model="query"
            placeholder="Cari tiket, aset, atau kerusakan…" /></label
        ><select v-model="status">
          <option value="active">Tiket aktif</option>
          <option value="all">Semua status</option>
          <option v-for="(v, k) in statusLabel" :value="k" :key="k">
            {{ v }}
          </option></select
        ><select v-model="priority">
          <option value="all">Semua prioritas</option>
          <option v-for="(v, k) in priorityLabel" :value="k" :key="k">
            {{ v }}
          </option></select
        ><select v-if="!isWadek" v-model="reportFilter">
          <option value="all">Semua laporan</option>
          <option value="sent">Sudah ke Wadek</option>
          <option value="pending">Belum ke Wadek</option></select
        ><button class="btn ghost" @click="load">↻</button>
      </div>
      <div class="result-line">
        Menampilkan <b>{{ filtered.length }}</b> dari {{ tickets.length }} tiket
      </div>
      <div v-if="loading" class="loading-block">
        <div />
        <div />
        <div />
      </div>
      <EmptyState
        v-else-if="!filtered.length"
        title="Laporan tidak ditemukan"
        text="Belum ada tiket atau filter terlalu spesifik."
      />
      <div v-else class="ticket-list">
        <article
          v-for="ticket in filtered"
          :key="ticket.wo_id"
          class="ticket-card"
        >
          <div class="ticket-accent" :class="ticket.prioritas" />
          <div class="ticket-main">
            <div class="ticket-top">
              <div>
                <span class="ticket-id">WO-{{ short(ticket.wo_id) }}</span
                ><StatusBadge :text="sourceLabel[ticket.asal_temuan]" />
              </div>
              <div class="row-actions">
                <StatusBadge
                  :text="
                    ticket.laporan_ke_wadek ? 'Sudah ke Wadek' : 'Belum dikirim'
                  "
                  :tone="ticket.laporan_ke_wadek ? 'success' : 'warning'"
                /><StatusBadge
                  :text="priorityLabel[ticket.prioritas]"
                  :tone="priorityTone(ticket.prioritas)"
                />
              </div>
            </div>
            <h3>
              {{
                assetMap.get(ticket.asset_id)?.nama_aset ||
                "Aset tidak ditemukan"
              }}
            </h3>
            <p>{{ ticket.deskripsi_kerusakan }}</p>
            <div class="ticket-meta">
              <span
                >Inventaris:
                <b>{{
                  assetMap.get(ticket.asset_id)?.no_inventaris || "—"
                }}</b></span
              ><span
                >Dibuat: <b>{{ date(ticket.created_at) }}</b></span
              ><StatusBadge
                :text="statusLabel[ticket.status_tiket]"
                :tone="statusTone(ticket.status_tiket)"
              />
            </div>
          </div>
          <div class="ticket-actions">
            <select
              v-if="
                isHead && !['closed', 'cancelled'].includes(ticket.status_tiket)
              "
              :value="ticket.prioritas"
              @change="
                setPriority(
                  ticket,
                  ($event.target as HTMLSelectElement)
                    .value as WorkOrderPriority,
                )
              "
            >
              <option v-for="(v, k) in priorityLabel" :key="k" :value="k">
                {{ v }}
              </option>
            </select>
            <button class="btn tiny ghost" @click="selected = ticket">
              Detail
            </button>
            <button
              v-if="isHead || isWadek"
              class="btn tiny ghost"
              @click="printReport(ticket)"
            >
              ▤ Cetak laporan
            </button>
            <button
              v-if="isHead"
              class="btn tiny"
              :class="ticket.laporan_ke_wadek ? 'ghost' : 'primary'"
              @click="markWadek(ticket)"
            >
              {{
                ticket.laporan_ke_wadek
                  ? "Batalkan tanda kirim"
                  : "Tandai dikirim"
              }}
            </button>
            <button
              v-if="nextAction(ticket)"
              class="btn tiny primary"
              @click="openAction(ticket, nextAction(ticket)!)"
            >
              {{ actionLabel[nextAction(ticket)!] }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <Modal
      v-if="selected"
      title="Detail work order"
      :subtitle="`WO-${short(selected.wo_id)}`"
      wide
      @close="selected = null"
      ><div class="detail-grid">
        <div v-for="item in details(selected)" :key="String(item[0])">
          <span>{{ item[0] }}</span
          ><strong>{{ item[1] || "—" }}</strong>
        </div>
      </div>
      <div v-if="selected.catatan_perbaikan" class="note-box">
        <h3>Catatan perbaikan</h3>
        <p>{{ selected.catatan_perbaikan }}</p>
      </div>
      <div class="modal-actions">
        <button
          v-if="isHead || isWadek"
          class="btn primary"
          @click="printReport(selected)"
        >
          ▤ Cetak laporan kerusakan
        </button>
      </div></Modal
    >
    <Modal
      v-if="dialog"
      :title="actionLabel[dialog.action]"
      :subtitle="assetMap.get(dialog.ticket.asset_id)?.nama_aset"
      @close="dialog = null"
      ><form @submit.prevent="submitAction">
        <template v-if="dialog.action === 'selesaikan'"
          ><label
            >Catatan perbaikan *<textarea
              v-model="actionForm.catatan"
              rows="4"
              required
            />
          </label>
          <div class="form-grid">
            <label
              >Biaya (Rp)<input
                v-model.number="actionForm.biaya"
                type="number"
                min="0" /></label
            ><label
              >Downtime (jam)<input
                v-model.number="actionForm.downtime"
                type="number"
                min="0"
                step="0.1"
            /></label></div
        ></template>
        <p v-else class="confirm-text">
          Yakin ingin mengubah status tiket ini?
        </p>
        <div class="modal-actions">
          <button type="button" class="btn ghost" @click="dialog = null">
            Batal</button
          ><button class="btn primary" :disabled="busy">
            {{ busy ? "Memproses…" : actionLabel[dialog.action] }}
          </button>
        </div>
      </form></Modal
    >
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { assetsApi, woApi } from "../api";
import { errorMessage } from "../api/client";
import { useAuthStore } from "../stores/auth";
import type {
  Asset,
  DamageReport,
  WorkOrder,
  WorkOrderAction,
  WorkOrderPriority,
  WorkOrderSource,
  WorkOrderStatus,
} from "../types";
import { EmptyState, Modal, StatCard, StatusBadge } from "../components/ui";

const auth = useAuthStore(),
  isTech = auth.user?.role === "teknisi",
  isHead = auth.user?.role === "kepala_lab",
  isWadek = auth.user?.role === "wakil_dekan";
const headingText = isTech
  ? "Kelola antrean dan catat hasil pekerjaan perbaikan."
  : isHead
    ? "Pantau progres, tentukan prioritas, dan kirim laporan ke Wakil Dekan."
    : "Lihat dan cetak laporan kerusakan yang telah dikirim Kepala Lab.";
const statusLabel: Record<WorkOrderStatus, string> = {
    open: "Terbuka",
    in_progress: "Dikerjakan",
    resolved: "Selesai diperbaiki",
    closed: "Ditutup",
    cancelled: "Dibatalkan",
  },
  priorityLabel: Record<WorkOrderPriority, string> = {
    rendah: "Rendah",
    sedang: "Sedang",
    tinggi: "Tinggi",
    critical: "Kritis",
  },
  sourceLabel: Record<WorkOrderSource, string> = {
    manual: "Laporan manual",
    stock_opname: "Stock opname",
    kalibrasi: "Kalibrasi",
  },
  actionLabel: Record<WorkOrderAction, string> = {
    mulai_kerjakan: "Mulai kerjakan",
    selesaikan: "Selesaikan perbaikan",
    buka_kembali: "Buka kembali",
    tutup: "Tutup tiket",
    batalkan: "Batalkan tiket",
  };
const tickets = ref<WorkOrder[]>([]),
  assets = ref<Asset[]>([]),
  loading = ref(true),
  busy = ref(false),
  error = ref(""),
  notice = ref(""),
  query = ref(""),
  status = ref<"active" | "all" | WorkOrderStatus>(isWadek ? "all" : "active"),
  priority = ref<"all" | WorkOrderPriority>("all"),
  reportFilter = ref<"all" | "sent" | "pending">("all"),
  selected = ref<WorkOrder | null>(null),
  dialog = ref<{ ticket: WorkOrder; action: WorkOrderAction } | null>(null),
  actionForm = reactive({ catatan: "", biaya: 0, downtime: 0 });
const assetMap = computed(
    () => new Map(assets.value.map((a) => [a.asset_id, a])),
  ),
  active = computed(
    () =>
      tickets.value.filter((t) =>
        ["open", "in_progress"].includes(t.status_tiket),
      ).length,
  ),
  critical = computed(
    () =>
      tickets.value.filter(
        (t) =>
          t.prioritas === "critical" &&
          !["closed", "cancelled"].includes(t.status_tiket),
      ).length,
  ),
  sentReports = computed(
    () => tickets.value.filter((t) => t.laporan_ke_wadek).length,
  ),
  countStatus = (s: WorkOrderStatus) =>
    tickets.value.filter((t) => t.status_tiket === s).length;
const filtered = computed(() =>
  tickets.value.filter((t) => {
    const a = assetMap.value.get(t.asset_id),
      hay = [t.wo_id, t.deskripsi_kerusakan, a?.nama_aset, a?.no_inventaris]
        .join(" ")
        .toLowerCase();
    const sm =
      status.value === "all" ||
      (status.value === "active" &&
        ["open", "in_progress", "resolved"].includes(t.status_tiket)) ||
      t.status_tiket === status.value;
    const rm =
      reportFilter.value === "all" ||
      (reportFilter.value === "sent" && t.laporan_ke_wadek) ||
      (reportFilter.value === "pending" && !t.laporan_ke_wadek);
    return (
      (!query.value || hay.includes(query.value.toLowerCase())) &&
      sm &&
      (priority.value === "all" || t.prioritas === priority.value) &&
      rm
    );
  }),
);

async function load() {
  loading.value = true;
  try {
    [tickets.value, assets.value] = await Promise.all([
      woApi.list(),
      assetsApi.list(),
    ]);
  } catch (e) {
    error.value = errorMessage(e, "Laporan kerusakan gagal dimuat.");
  } finally {
    loading.value = false;
  }
}
function replace(t: WorkOrder) {
  tickets.value = tickets.value.map((x) => (x.wo_id === t.wo_id ? t : x));
  if (selected.value?.wo_id === t.wo_id) selected.value = t;
}
function nextAction(t: WorkOrder): WorkOrderAction | null {
  if (isTech) {
    if (t.status_tiket === "open") return "mulai_kerjakan";
    if (t.status_tiket === "in_progress") return "selesaikan";
    if (t.status_tiket === "resolved") return "buka_kembali";
  }
  if (isHead && t.status_tiket === "resolved") return "tutup";
  return null;
}
function openAction(t: WorkOrder, a: WorkOrderAction) {
  dialog.value = { ticket: t, action: a };
  Object.assign(actionForm, { catatan: "", biaya: 0, downtime: 0 });
}
async function submitAction() {
  if (!dialog.value) return;
  busy.value = true;
  try {
    const d = dialog.value;
    const p: any = { action: d.action };
    if (d.action === "selesaikan")
      Object.assign(p, {
        catatan_perbaikan: actionForm.catatan,
        biaya: actionForm.biaya,
        downtime_jam: actionForm.downtime,
      });
    replace(await woApi.transition(d.ticket.wo_id, p));
    notice.value = "Status work order berhasil diperbarui.";
    dialog.value = null;
  } catch (e) {
    error.value = errorMessage(e, "Status tiket gagal diperbarui.");
  } finally {
    busy.value = false;
  }
}
async function setPriority(t: WorkOrder, p: WorkOrderPriority) {
  try {
    replace(await woApi.priority(t.wo_id, p));
    notice.value = "Prioritas berhasil diperbarui.";
  } catch (e) {
    error.value = errorMessage(e, "Prioritas gagal diperbarui.");
  }
}
async function markWadek(t: WorkOrder) {
  try {
    replace(await woApi.markWadek(t.wo_id, !t.laporan_ke_wadek));
    notice.value = t.laporan_ke_wadek
      ? "Penandaan pengiriman dibatalkan."
      : "Laporan ditandai sudah dikirim manual ke Wakil Dekan.";
  } catch (e) {
    error.value = errorMessage(e);
  }
}

async function printReport(ticket: WorkOrder) {
  const popup = window.open("", "_blank", "width=900,height=800");
  if (!popup) {
    error.value =
      "Popup diblokir browser. Izinkan popup untuk mencetak laporan.";
    return;
  }
  popup.document.write(
    '<p style="font-family:Arial;padding:30px">Menyiapkan laporan…</p>',
  );
  try {
    const report = await woApi.report(ticket.wo_id);
    popup.document.open();
    popup.document.write(reportHtml(report));
    popup.document.close();
    popup.focus();
    setTimeout(() => popup.print(), 250);
  } catch (e) {
    popup.close();
    error.value = errorMessage(e, "Laporan gagal dibuat.");
  }
}
function safe(v: unknown) {
  return String(v ?? "—").replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ]!,
  );
}
function reportHtml(r: DamageReport) {
  const w = r.work_order,
    a = r.asset;
  return `<!doctype html><html><head><title>${safe(r.nomor_laporan)}</title><style>body{font-family:Arial,sans-serif;color:#17231b;margin:42px}header{display:flex;gap:16px;align-items:center;border-bottom:3px solid #266b43;padding-bottom:18px}header img{width:64px}h1{font-size:22px;margin:0;color:#1e5d39}header p{margin:5px 0 0;font-size:12px}.meta{margin:24px 0;display:grid;grid-template-columns:180px 1fr;font-size:13px}.meta span,.meta b{padding:8px;border-bottom:1px solid #ddd}.box{border:1px solid #bbb;border-radius:8px;padding:18px;margin:18px 0}.box h2{font-size:15px;margin:0 0 12px;color:#266b43}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px}.grid div{border-bottom:1px solid #ddd;padding:7px}.grid small{display:block;color:#777;margin-bottom:4px}.description{min-height:80px;font-size:13px;line-height:1.6}.sign{display:grid;grid-template-columns:1fr 1fr;gap:100px;margin-top:60px;text-align:center;font-size:12px}.sign div:after{content:'';display:block;border-bottom:1px solid #222;margin:70px 20px 5px}@media print{button{display:none}body{margin:20mm}}</style></head><body><header><img src="${window.location.origin}/logo192.png"><div><h1>LAPORAN KERUSAKAN ASET LABORATORIUM</h1><p>Fakultas Ilmu Komputer · UPN Veteran Jakarta</p></div></header><div class="meta"><span>Nomor laporan</span><b>${safe(r.nomor_laporan)}</b><span>Tanggal laporan</span><b>${safe(date(r.dibuat_pada))}</b><span>Status pengiriman</span><b>${w.laporan_ke_wadek ? "Telah dikirim ke Wakil Dekan" : "Draft / belum ditandai dikirim"}</b></div><section class="box"><h2>Identitas aset</h2><div class="grid"><div><small>Nama aset</small><b>${safe(a.nama_aset)}</b></div><div><small>Nomor inventaris</small><b>${safe(a.no_inventaris)}</b></div><div><small>Merek / model</small><b>${safe([a.merek, a.model].filter(Boolean).join(" / "))}</b></div><div><small>Serial number</small><b>${safe(a.serial_number)}</b></div><div><small>Kategori</small><b>${safe(a.kategori)}</b></div><div><small>Lokasi</small><b>${safe(a.lokasi)}</b></div></div></section><section class="box"><h2>Detail kerusakan</h2><div class="grid"><div><small>Sumber temuan</small><b>${safe(sourceLabel[w.asal_temuan])}</b></div><div><small>Prioritas</small><b>${safe(priorityLabel[w.prioritas])}</b></div><div><small>Status tiket</small><b>${safe(statusLabel[w.status_tiket])}</b></div><div><small>Tanggal ditemukan</small><b>${safe(date(w.created_at))}</b></div></div><p class="description">${safe(w.deskripsi_kerusakan)}</p></section>${w.catatan_perbaikan ? `<section class="box"><h2>Hasil perbaikan</h2><p class="description">${safe(w.catatan_perbaikan)}</p><div class="grid"><div><small>Biaya</small><b>${safe(w.biaya == null ? "—" : currency(w.biaya))}</b></div><div><small>Downtime</small><b>${safe(w.downtime_jam == null ? "—" : w.downtime_jam + " jam")}</b></div></div></section>` : ""}<div class="sign"><div>Kepala Laboratorium</div><div>Wakil Dekan</div></div></body></html>`;
}

const short = (id: string) => id.slice(0, 8).toUpperCase(),
  date = (v: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(v)),
  currency = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(v),
  priorityTone = (p: WorkOrderPriority) =>
    p === "critical" ? "danger" : p === "tinggi" ? "warning" : "neutral",
  statusTone = (s: WorkOrderStatus) =>
    s === "closed"
      ? "success"
      : s === "cancelled"
        ? "danger"
        : s === "resolved"
          ? "warning"
          : "info";
const details = (t: WorkOrder) => [
  ["Aset", assetMap.value.get(t.asset_id)?.nama_aset],
  ["Status", statusLabel[t.status_tiket]],
  ["Prioritas", priorityLabel[t.prioritas]],
  ["Sumber", sourceLabel[t.asal_temuan]],
  [
    "Laporan Wadek",
    t.laporan_ke_wadek
      ? `Dikirim ${t.waktu_laporan_ke_wadek ? date(t.waktu_laporan_ke_wadek) : ""}`
      : "Belum dikirim",
  ],
  ["Kerusakan", t.deskripsi_kerusakan],
  ["Biaya", t.biaya == null ? "—" : currency(t.biaya)],
  ["Downtime", t.downtime_jam == null ? "—" : `${t.downtime_jam} jam`],
  ["Teknisi", t.dikerjakan_oleh],
];
onMounted(load);
</script>
