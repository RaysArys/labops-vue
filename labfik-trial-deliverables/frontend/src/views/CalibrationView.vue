<template>
  <div class="page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">KETERTELUSURAN ALAT UKUR</span>
        <h1>Kalibrasi & parameter</h1>
        <p>
          {{
            isLaboran
              ? "Catat nilai aktual; sistem membandingkannya dengan standar."
              : "Atur standar pengukuran dan tinjau hasil kalibrasi."
          }}
        </p>
      </div>
      <div class="row-actions">
        <button v-if="isHead" class="btn ghost" @click="parameterModal = true">
          ⚙ Master parameter
        </button>
        <button class="btn primary" @click="scheduleModal = true">
          ＋ Jadwal baru
        </button>
      </div>
    </header>

    <div v-if="notice" class="alert success">
      {{ notice }}<button @click="notice = ''">×</button>
    </div>
    <div v-if="error" class="alert danger">
      {{ error }}<button @click="error = ''">×</button>
    </div>

    <section class="stats-grid">
      <StatCard
        label="Total jadwal"
        :value="schedules.length"
        hint="Aset terjadwal"
        icon="⌖"
      />
      <StatCard
        label="Parameter aktif"
        :value="parameters.filter((p) => p.aktif).length"
        hint="Standar pengukuran"
        icon="≋"
      />
      <StatCard
        label="Overdue"
        :value="count('overdue')"
        hint="Melewati batas"
        icon="!"
        tone="danger"
      />
      <StatCard
        label="Menunggu perbaikan"
        :value="count('menunggu_perbaikan')"
        hint="Work order aktif"
        icon="⌁"
      />
    </section>

    <section class="calibration-workspace">
      <aside class="panel schedule-panel">
        <div class="toolbar compact">
          <label class="search"
            >⌕<input v-model="query" placeholder="Cari aset…"
          /></label>
          <select v-model="status">
            <option value="all">Semua status</option>
            <option v-for="(v, k) in scheduleLabel" :key="k" :value="k">
              {{ v }}
            </option>
          </select>
        </div>
        <div class="list-caption">
          <b>JADWAL KALIBRASI</b><span>{{ filtered.length }} aset</span>
        </div>
        <div v-if="loading" class="loading-block">
          <div />
          <div />
          <div />
        </div>
        <EmptyState
          v-else-if="!filtered.length"
          title="Jadwal tidak ditemukan"
          text="Buat jadwal atau ubah filter."
        />
        <button
          v-for="s in filtered"
          :key="s.schedule_id"
          class="schedule-item"
          :class="{ active: selectedId === s.schedule_id }"
          @click="select(s.schedule_id)"
        >
          <div>
            <span class="asset-symbol">⌖</span>
            <div>
              <strong>{{
                assetMap.get(s.asset_id)?.nama_aset || "Aset tidak ditemukan"
              }}</strong
              ><small>{{
                assetMap.get(s.asset_id)?.no_inventaris || short(s.asset_id)
              }}</small>
            </div>
          </div>
          <StatusBadge
            :text="scheduleLabel[s.status_kalibrasi]"
            :tone="scheduleTone(s.status_kalibrasi)"
          />
          <span
            >Jatuh tempo
            <b>{{
              s.tanggal_jatuh_tempo ? date(s.tanggal_jatuh_tempo) : "—"
            }}</b></span
          >
        </button>
      </aside>

      <main class="panel calibration-detail">
        <EmptyState
          v-if="!selected"
          title="Pilih jadwal"
          text="Detail dan riwayat kalibrasi akan tampil di sini."
        />
        <template v-else>
          <div class="detail-heading">
            <div class="asset-cell">
              <span>⌖</span>
              <div>
                <small>DETAIL JADWAL</small>
                <h2>
                  {{ selectedAsset?.nama_aset || "Aset tidak ditemukan" }}
                </h2>
                <p>
                  {{
                    selectedAsset?.no_inventaris || short(selected.asset_id)
                  }}
                  · {{ categoryLabel[selectedAsset?.kategori || "alat_ukur"] }}
                </p>
              </div>
            </div>
            <div class="row-actions">
              <button class="btn tiny ghost" @click="refreshStatus">
                ↻ Refresh</button
              ><button
                v-if="
                  isLaboran &&
                  selected.status_kalibrasi !== 'menunggu_perbaikan'
                "
                class="btn tiny primary"
                @click="openResult"
              >
                Catat hasil</button
              ><button
                v-if="
                  isHead && selected.status_kalibrasi === 'menunggu_perbaikan'
                "
                class="btn tiny primary"
                @click="finishRepair"
              >
                Perbaikan selesai
              </button>
            </div>
          </div>
          <div class="detail-grid four">
            <div>
              <span>Status</span
              ><StatusBadge
                :text="scheduleLabel[selected.status_kalibrasi]"
                :tone="scheduleTone(selected.status_kalibrasi)"
              />
            </div>
            <div>
              <span>Interval</span
              ><strong>{{ selected.interval_bulan }} bulan</strong>
            </div>
            <div>
              <span>Standar aktif</span
              ><strong>{{ currentParameters.length }} parameter</strong>
            </div>
            <div>
              <span>Jatuh tempo</span
              ><strong>{{
                selected.tanggal_jatuh_tempo
                  ? date(selected.tanggal_jatuh_tempo)
                  : "—"
              }}</strong>
            </div>
          </div>
          <div
            v-if="selected.status_kalibrasi === 'menunggu_perbaikan'"
            class="alert warning"
          >
            ⌁ Aset menunggu penyelesaian Work Order sebelum dikalibrasi ulang.
          </div>

          <div class="panel-title history">
            <div>
              <h3>Riwayat pelaksanaan</h3>
              <p>{{ logs.length }} catatan kalibrasi</p>
            </div>
          </div>
          <div v-if="logsLoading" class="loading-block">
            <div />
            <div />
          </div>
          <EmptyState
            v-else-if="!logs.length"
            title="Belum ada hasil"
            text="Catat pelaksanaan pertama untuk memulai riwayat."
          />
          <div v-else class="log-list">
            <article v-for="log in logs" :key="log.log_id" class="log-card">
              <div class="log-top">
                <div>
                  <b>{{ date(log.tanggal_pelaksanaan) }}</b
                  ><small>LOG-{{ short(log.log_id) }}</small>
                </div>
                <div class="row-actions">
                  <StatusBadge
                    :text="resultLabel[log.hasil]"
                    :tone="log.hasil === 'tidak_lulus' ? 'danger' : 'success'"
                  /><StatusBadge
                    :text="logLabel[log.status_approval]"
                    :tone="logTone(log.status_approval)"
                  />
                </div>
              </div>
              <div v-if="log.pengukuran?.length" class="measurement-table">
                <div class="measurement-head">
                  <span>Parameter</span><span>Standar</span><span>Aktual</span
                  ><span>Status</span>
                </div>
                <div v-for="m in log.pengukuran" :key="m.parameter_id">
                  <strong>{{ m.nama_parameter }}</strong
                  ><span>{{ boundText(m) }}</span
                  ><b>{{ m.nilai_aktual }} {{ m.satuan }}</b
                  ><StatusBadge
                    :text="m.status === 'normal' ? 'Normal' : 'Tidak normal'"
                    :tone="m.status === 'normal' ? 'success' : 'danger'"
                  />
                </div>
              </div>
              <div class="detail-grid three">
                <div>
                  <span>Vendor</span
                  ><strong>{{
                    log.vendor_id
                      ? vendorMap.get(log.vendor_id)?.nama_vendor ||
                        "Tidak ditemukan"
                      : "Internal"
                  }}</strong>
                </div>
                <div>
                  <span>Biaya</span
                  ><strong>{{
                    log.biaya == null ? "—" : currency(log.biaya)
                  }}</strong>
                </div>
                <div>
                  <span>Work order</span
                  ><strong>{{
                    log.work_order_id ? "WO-" + short(log.work_order_id) : "—"
                  }}</strong>
                </div>
              </div>
              <p v-if="log.deviasi" class="note-box">{{ log.deviasi }}</p>
              <div v-if="log.alasan_penolakan" class="alert danger">
                {{ log.alasan_penolakan }}
              </div>
              <div
                v-if="isHead && log.status_approval === 'pending_approval'"
                class="row-actions review"
              >
                <button
                  class="btn tiny danger"
                  @click="openReview(log, 'tolak_teknis')"
                >
                  Tolak teknis</button
                ><button
                  class="btn tiny ghost"
                  @click="openReview(log, 'tolak_dokumen')"
                >
                  Tolak dokumen</button
                ><button
                  class="btn tiny primary"
                  @click="openReview(log, 'setujui')"
                >
                  Setujui
                </button>
              </div>
            </article>
          </div>
        </template>
      </main>
    </section>

    <Modal
      v-if="scheduleModal"
      title="Buat jadwal kalibrasi"
      subtitle="Pilih aset dan interval pemeriksaan"
      @close="scheduleModal = false"
    >
      <form @submit.prevent="createSchedule">
        <label
          >Aset *<select v-model="scheduleForm.asset" required>
            <option value="">Pilih aset</option>
            <option v-for="a in assets" :key="a.asset_id" :value="a.asset_id">
              {{ a.nama_aset }} — {{ a.no_inventaris || "tanpa nomor" }}
            </option>
          </select></label
        >
        <div class="form-grid">
          <label
            >Interval (bulan) *<input
              v-model.number="scheduleForm.interval"
              type="number"
              min="1"
              required /></label
          ><label
            >Kalibrasi terakhir<input v-model="scheduleForm.last" type="date"
          /></label>
        </div>
        <div class="modal-actions">
          <button
            type="button"
            class="btn ghost"
            @click="scheduleModal = false"
          >
            Batal</button
          ><button class="btn primary" :disabled="busy">
            {{ busy ? "Menyimpan…" : "Buat jadwal" }}
          </button>
        </div>
      </form>
    </Modal>

    <Modal
      v-if="resultModal && selected"
      title="Catat hasil pengukuran"
      :subtitle="selectedAsset?.nama_aset"
      wide
      @close="resultModal = false"
    >
      <form @submit.prevent="recordResult">
        <div class="form-grid">
          <label
            >Tanggal pelaksanaan *<input
              v-model="resultForm.date"
              type="date"
              required /></label
          ><label
            >Vendor<select v-model="resultForm.vendor">
              <option value="">Internal / tanpa vendor</option>
              <option
                v-for="v in vendors"
                :key="v.vendor_id"
                :value="v.vendor_id"
              >
                {{ v.nama_vendor }}
              </option>
            </select></label
          >
        </div>
        <div v-if="currentParameters.length" class="measurement-inputs">
          <div class="section-title-row">
            <div>
              <h3>Parameter pengukuran</h3>
              <small
                >Nilai dibandingkan otomatis dengan standar
                {{
                  categoryLabel[selectedAsset?.kategori || "alat_ukur"]
                }}.</small
              >
            </div>
            <StatusBadge
              :text="
                predictedResult === 'lulus'
                  ? 'Prediksi: Lulus'
                  : 'Prediksi: Tidak lulus'
              "
              :tone="predictedResult === 'lulus' ? 'success' : 'danger'"
            />
          </div>
          <label
            v-for="p in currentParameters"
            :key="p.parameter_id"
            class="measurement-input"
            ><span
              ><b>{{ p.nama_parameter }}</b
              ><small>Standar {{ parameterBound(p) }}</small></span
            ><span
              ><input
                v-model.number="measurementValues[p.parameter_id]"
                type="number"
                step="any"
                required
              /><em>{{ p.satuan }}</em></span
            ></label
          >
        </div>
        <div v-else class="alert warning">
          Belum ada parameter untuk kategori ini. Hasil masih dicatat manual;
          minta Kepala Lab mengisi master parameter.
        </div>
        <label v-if="!currentParameters.length"
          >Hasil manual *<select v-model="resultForm.result">
            <option v-for="(v, k) in resultLabel" :key="k" :value="k">
              {{ v }}
            </option>
          </select></label
        >
        <div class="form-grid">
          <label
            >Biaya (Rp)<input
              v-model.number="resultForm.cost"
              type="number"
              min="0" /></label
          ><label
            >Catatan / kondisi<textarea
              v-model="resultForm.notes"
              rows="3"
              placeholder="Contoh: suhu tidak stabil, fan berisik…"
            />
          </label>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn ghost" @click="resultModal = false">
            Batal</button
          ><button class="btn primary" :disabled="busy">
            {{ busy ? "Mengirim…" : "Kirim untuk ditinjau" }}
          </button>
        </div>
      </form>
    </Modal>

    <Modal
      v-if="parameterModal"
      title="Master parameter pengukuran"
      subtitle="Dikelola Kepala Lab dan digunakan otomatis oleh Laboran"
      wide
      @close="closeParameterModal"
    >
      <div class="parameter-toolbar">
        <select v-model="parameterCategory">
          <option v-for="(v, k) in categoryLabel" :key="k" :value="k">
            {{ v }}
          </option></select
        ><button class="btn primary" @click="startNewParameter">
          ＋ Parameter
        </button>
      </div>
      <div v-if="parameterEditing" class="parameter-form">
        <div class="form-grid">
          <label
            >Nama parameter *<input
              v-model="parameterForm.name"
              required
              placeholder="Contoh: Memory idle" /></label
          ><label
            >Kode *<input
              v-model="parameterForm.code"
              required
              placeholder="memory_idle" /></label
          ><label
            >Satuan *<input
              v-model="parameterForm.unit"
              required
              placeholder="%, °C, MB/s" /></label
          ><label
            >Status<select v-model="parameterForm.active">
              <option :value="true">Aktif</option>
              <option :value="false">Nonaktif</option>
            </select></label
          ><label
            >Batas minimum<input
              v-model="parameterForm.min"
              type="number"
              step="any"
              placeholder="Kosong jika tidak dipakai" /></label
          ><label
            >Batas maksimum<input
              v-model="parameterForm.max"
              type="number"
              step="any"
              placeholder="Kosong jika tidak dipakai"
          /></label>
        </div>
        <p class="form-hint">
          Isi minimal salah satu batas. Contoh memory idle maksimal 20%: minimum
          kosong, maksimum 20.
        </p>
        <div class="modal-actions">
          <button class="btn ghost" @click="parameterEditing = null">
            Batal</button
          ><button class="btn primary" :disabled="busy" @click="saveParameter">
            {{ busy ? "Menyimpan…" : "Simpan parameter" }}
          </button>
        </div>
      </div>
      <div class="parameter-list">
        <div class="measurement-head">
          <span>Parameter</span><span>Standar</span><span>Status</span
          ><span>Aksi</span>
        </div>
        <div v-for="p in categoryParameters" :key="p.parameter_id">
          <strong
            >{{ p.nama_parameter
            }}<small>{{ p.kode }} · {{ p.satuan }}</small></strong
          ><span>{{ parameterBound(p) }}</span
          ><StatusBadge
            :text="p.aktif ? 'Aktif' : 'Nonaktif'"
            :tone="p.aktif ? 'success' : 'neutral'"
          /><button class="btn tiny ghost" @click="editParameter(p)">
            Edit
          </button>
        </div>
        <EmptyState
          v-if="!categoryParameters.length"
          title="Belum ada parameter"
          text="Tambahkan standar resmi setelah disepakati pihak UPN."
        />
      </div>
    </Modal>

    <Modal
      v-if="review"
      :title="reviewTitle"
      :subtitle="`LOG-${short(review.log.log_id)}`"
      @close="review = null"
      ><form @submit.prevent="submitReview">
        <label v-if="review.action !== 'setujui'"
          >Alasan *<textarea v-model="reviewReason" rows="4" required />
        </label>
        <p v-else class="confirm-text">
          Setujui hasil ini dan hitung jadwal kalibrasi berikutnya?
        </p>
        <div class="modal-actions">
          <button type="button" class="btn ghost" @click="review = null">
            Batal</button
          ><button class="btn primary" :disabled="busy">
            {{ busy ? "Memproses…" : "Konfirmasi" }}
          </button>
        </div>
      </form></Modal
    >
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { assetsApi, calibrationApi, vendorsApi } from "../api";
import { errorMessage } from "../api/client";
import { useAuthStore } from "../stores/auth";
import type {
  Asset,
  AssetKategori,
  CalibrationLog,
  CalibrationLogStatus,
  CalibrationMeasurement,
  CalibrationParameter,
  CalibrationResult,
  CalibrationReviewAction,
  CalibrationSchedule,
  CalibrationScheduleStatus,
  Vendor,
} from "../types";
import { EmptyState, Modal, StatCard, StatusBadge } from "../components/ui";

const auth = useAuthStore();
const isLaboran = auth.user?.role === "laboran";
const isHead = auth.user?.role === "kepala_lab";
const scheduleLabel: Record<CalibrationScheduleStatus, string> = {
  dijadwalkan: "Dijadwalkan",
  akan_jatuh_tempo: "Akan jatuh tempo",
  overdue: "Overdue",
  menunggu_perbaikan: "Menunggu perbaikan",
};
const logLabel: Record<CalibrationLogStatus, string> = {
  pending_approval: "Menunggu tinjauan",
  approved: "Disetujui",
  rejected_dokumen: "Dokumen ditolak",
  rejected_teknis: "Teknis ditolak",
};
const resultLabel: Record<CalibrationResult, string> = {
  lulus: "Lulus",
  lulus_bersyarat: "Lulus bersyarat",
  tidak_lulus: "Tidak lulus",
};
const categoryLabel: Record<AssetKategori, string> = {
  alat_ukur: "Alat ukur",
  jaringan: "Jaringan",
  server_pc: "Server / PC",
  iot_embedded: "IoT / embedded",
  kelistrikan_ups: "Kelistrikan / UPS",
  audio_visual: "Audio visual",
  sparepart_bhp: "Sparepart / BHP",
};

const schedules = ref<CalibrationSchedule[]>([]),
  assets = ref<Asset[]>([]),
  vendors = ref<Vendor[]>([]),
  parameters = ref<CalibrationParameter[]>([]),
  logs = ref<CalibrationLog[]>([]);
const selectedId = ref(""),
  loading = ref(true),
  logsLoading = ref(false),
  busy = ref(false),
  error = ref(""),
  notice = ref(""),
  query = ref("");
const status = ref<"all" | CalibrationScheduleStatus>("all"),
  scheduleModal = ref(false),
  resultModal = ref(false),
  parameterModal = ref(false),
  review = ref<{ log: CalibrationLog; action: CalibrationReviewAction } | null>(
    null,
  ),
  reviewReason = ref("");
const scheduleForm = reactive({ asset: "", interval: 12, last: "" });
const resultForm = reactive({
  date: new Date().toISOString().slice(0, 10),
  result: "lulus" as CalibrationResult,
  vendor: "",
  notes: "",
  cost: 0,
});
const measurementValues = reactive<Record<string, number | undefined>>({});
const parameterCategory = ref<AssetKategori>("server_pc"),
  parameterEditing = ref<string | null>(null);
const parameterForm = reactive({
  name: "",
  code: "",
  unit: "",
  min: "",
  max: "",
  active: true,
});

const assetMap = computed(
    () => new Map(assets.value.map((a) => [a.asset_id, a])),
  ),
  vendorMap = computed(
    () => new Map(vendors.value.map((v) => [v.vendor_id, v])),
  );
const selected = computed(() =>
  schedules.value.find((s) => s.schedule_id === selectedId.value),
);
const selectedAsset = computed(() =>
  selected.value ? assetMap.value.get(selected.value.asset_id) : undefined,
);
const currentParameters = computed(() =>
  parameters.value.filter(
    (p) => p.aktif && p.kategori_aset === selectedAsset.value?.kategori,
  ),
);
const categoryParameters = computed(() =>
  parameters.value.filter((p) => p.kategori_aset === parameterCategory.value),
);
const predictedResult = computed<CalibrationResult>(() =>
  currentParameters.value.some((p) => {
    const value = measurementValues[p.parameter_id];
    return (
      value !== undefined &&
      ((p.batas_min !== null && value < p.batas_min) ||
        (p.batas_max !== null && value > p.batas_max))
    );
  })
    ? "tidak_lulus"
    : "lulus",
);
const filtered = computed(() =>
  schedules.value.filter(
    (s) =>
      (status.value === "all" || s.status_kalibrasi === status.value) &&
      (!query.value ||
        [
          assetMap.value.get(s.asset_id)?.nama_aset,
          assetMap.value.get(s.asset_id)?.no_inventaris,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.value.toLowerCase())),
  ),
);
const reviewTitle = computed(() =>
  review.value?.action === "setujui"
    ? "Setujui hasil"
    : review.value?.action === "tolak_teknis"
      ? "Tolak teknis & buat Work Order"
      : "Tolak dokumen",
);
const count = (s: CalibrationScheduleStatus) =>
  schedules.value.filter((x) => x.status_kalibrasi === s).length;

async function load() {
  loading.value = true;
  try {
    [schedules.value, assets.value, vendors.value, parameters.value] =
      await Promise.all([
        calibrationApi.schedules(),
        assetsApi.list(),
        vendorsApi.list(),
        calibrationApi.parameters(undefined, isHead),
      ]);
    if (schedules.value[0]) await select(schedules.value[0].schedule_id);
  } catch (e) {
    error.value = errorMessage(e, "Kalibrasi gagal dimuat.");
  } finally {
    loading.value = false;
  }
}
async function select(id: string) {
  selectedId.value = id;
  logsLoading.value = true;
  try {
    logs.value = await calibrationApi.logs(id);
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    logsLoading.value = false;
  }
}
function replaceSchedule(s: CalibrationSchedule) {
  schedules.value = schedules.value.map((x) =>
    x.schedule_id === s.schedule_id ? s : x,
  );
}
async function createSchedule() {
  busy.value = true;
  try {
    const s = await calibrationApi.create({
      asset_id: scheduleForm.asset,
      interval_bulan: scheduleForm.interval,
      ...(scheduleForm.last
        ? { tanggal_kalibrasi_terakhir: scheduleForm.last }
        : {}),
    });
    schedules.value = [s, ...schedules.value];
    scheduleModal.value = false;
    await select(s.schedule_id);
    notice.value = "Jadwal kalibrasi berhasil dibuat.";
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    busy.value = false;
  }
}
function openResult() {
  Object.keys(measurementValues).forEach((k) => delete measurementValues[k]);
  currentParameters.value.forEach(
    (p) => (measurementValues[p.parameter_id] = undefined),
  );
  resultModal.value = true;
}
async function recordResult() {
  if (!selected.value) return;
  busy.value = true;
  try {
    const pengukuran = currentParameters.value.map((p) => ({
      parameter_id: p.parameter_id,
      nilai_aktual: Number(measurementValues[p.parameter_id]),
    }));
    const log = await calibrationApi.record(selected.value.schedule_id, {
      tanggal_pelaksanaan: resultForm.date,
      ...(pengukuran.length ? { pengukuran } : { hasil: resultForm.result }),
      ...(resultForm.vendor ? { vendor_id: resultForm.vendor } : {}),
      ...(resultForm.notes ? { deviasi: resultForm.notes } : {}),
      ...(resultForm.cost ? { biaya: resultForm.cost } : {}),
    });
    logs.value = [log, ...logs.value];
    resultModal.value = false;
    notice.value = `Hasil ${resultLabel[log.hasil]} dikirim untuk ditinjau.`;
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    busy.value = false;
  }
}
function openReview(log: CalibrationLog, action: CalibrationReviewAction) {
  review.value = { log, action };
  reviewReason.value = "";
}
async function submitReview() {
  if (!review.value) return;
  busy.value = true;
  try {
    const updated = await calibrationApi.review(
      review.value.log.log_id,
      review.value.action,
      reviewReason.value || undefined,
    );
    logs.value = logs.value.map((x) =>
      x.log_id === updated.log_id ? updated : x,
    );
    review.value = null;
    notice.value = "Tinjauan berhasil disimpan.";
    await load();
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    busy.value = false;
  }
}
async function refreshStatus() {
  if (!selected.value) return;
  try {
    replaceSchedule(await calibrationApi.refresh(selected.value.schedule_id));
    notice.value = "Status jadwal diperbarui.";
  } catch (e) {
    error.value = errorMessage(e);
  }
}
async function finishRepair() {
  if (!selected.value) return;
  try {
    replaceSchedule(await calibrationApi.repair(selected.value.schedule_id));
    notice.value = "Jadwal dikembalikan untuk kalibrasi ulang.";
  } catch (e) {
    error.value = errorMessage(e);
  }
}

function startNewParameter() {
  parameterEditing.value = "new";
  Object.assign(parameterForm, {
    name: "",
    code: "",
    unit: "",
    min: "",
    max: "",
    active: true,
  });
}
function editParameter(p: CalibrationParameter) {
  parameterEditing.value = p.parameter_id;
  Object.assign(parameterForm, {
    name: p.nama_parameter,
    code: p.kode,
    unit: p.satuan,
    min: p.batas_min === null ? "" : String(p.batas_min),
    max: p.batas_max === null ? "" : String(p.batas_max),
    active: p.aktif,
  });
}
async function saveParameter() {
  if (!parameterForm.min && !parameterForm.max) {
    error.value = "Isi minimal batas minimum atau maksimum.";
    return;
  }
  busy.value = true;
  try {
    const payload = {
      kategori_aset: parameterCategory.value,
      kode: parameterForm.code,
      nama_parameter: parameterForm.name,
      satuan: parameterForm.unit,
      batas_min: parameterForm.min === "" ? null : Number(parameterForm.min),
      batas_max: parameterForm.max === "" ? null : Number(parameterForm.max),
      aktif: parameterForm.active,
    };
    const saved =
      parameterEditing.value === "new"
        ? await calibrationApi.createParameter(payload)
        : await calibrationApi.updateParameter(
            parameterEditing.value!,
            payload,
          );
    parameters.value =
      parameterEditing.value === "new"
        ? [...parameters.value, saved]
        : parameters.value.map((p) =>
            p.parameter_id === saved.parameter_id ? saved : p,
          );
    parameterEditing.value = null;
    notice.value = "Master parameter berhasil disimpan.";
  } catch (e) {
    error.value = errorMessage(e, "Parameter gagal disimpan.");
  } finally {
    busy.value = false;
  }
}
function closeParameterModal() {
  parameterModal.value = false;
  parameterEditing.value = null;
}

const short = (id: string) => id.slice(0, 8).toUpperCase();
const date = (v: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(v));
const currency = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
const scheduleTone = (s: CalibrationScheduleStatus) =>
  s === "overdue"
    ? "danger"
    : s === "akan_jatuh_tempo" || s === "menunggu_perbaikan"
      ? "warning"
      : "success";
const logTone = (s: CalibrationLogStatus) =>
  s === "approved"
    ? "success"
    : s.startsWith("rejected")
      ? "danger"
      : "warning";
const parameterBound = (p: {
  batas_min: number | null;
  batas_max: number | null;
  satuan: string;
}) =>
  p.batas_min !== null && p.batas_max !== null
    ? `${p.batas_min}–${p.batas_max} ${p.satuan}`
    : p.batas_min !== null
      ? `minimal ${p.batas_min} ${p.satuan}`
      : `maksimal ${p.batas_max} ${p.satuan}`;
const boundText = (m: CalibrationMeasurement) => parameterBound(m);
onMounted(load);
</script>
