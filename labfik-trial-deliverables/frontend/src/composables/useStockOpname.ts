import { computed, onMounted, reactive, ref } from "vue";
import { assetsApi, opnameApi } from "../api";
import { errorMessage } from "../api/client";
import { useAuthStore } from "../stores/auth";
import type {
  Asset,
  AssetKategori,
  AssetKondisi,
  FindingStatus,
  FollowUpStatus,
  StockOpnamePeriod,
  StockOpnameRecord,
} from "../types";

export function useStockOpname() {
  const auth = useAuthStore();
  const isLaboran = auth.user?.role === "laboran";
  const isHead = auth.user?.role === "kepala_lab";
  const conditionLabel: Record<AssetKondisi, string> = {
    baik: "Baik",
    rusak: "Rusak",
    dalam_perbaikan: "Dalam perbaikan",
    hilang: "Hilang",
    cadangan: "Cadangan",
  };
  const findingLabel: Record<FindingStatus, string> = {
    sesuai: "Sesuai",
    tidak_sesuai: "Tidak sesuai",
    tidak_ditemukan: "Tidak ditemukan",
    kelebihan_fisik: "Kelebihan fisik",
  };
  const followLabel: Record<FollowUpStatus, string> = {
    open: "Terbuka",
    in_progress: "Ditindaklanjuti",
    selesai: "Selesai",
  };
  const categoryLabel: Record<AssetKategori, string> = {
    alat_ukur: "Alat ukur",
    jaringan: "Jaringan",
    server_pc: "Server & PC",
    iot_embedded: "IoT & Embedded",
    kelistrikan_ups: "Kelistrikan & UPS",
    audio_visual: "Audio visual",
    sparepart_bhp: "Sparepart & BHP",
  };

  const periods = ref<StockOpnamePeriod[]>([]);
  const records = ref<StockOpnameRecord[]>([]);
  const assets = ref<Asset[]>([]);
  const selectedPeriodId = ref("");
  const loading = ref(true);
  const recordsLoading = ref(false);
  const busy = ref(false);
  const error = ref("");
  const notice = ref("");
  const query = ref("");
  const finding = ref<"all" | "open" | FindingStatus>("all");
  const periodModal = ref(false);
  const inspectionModal = ref(false);
  const inspectionTab = ref<"existing" | "new">("existing");
  const assetSearch = ref("");
  const searchResults = ref<Asset[]>([]);
  const followRecord = ref<StockOpnameRecord | null>(null);
  const periodForm = reactive({
    tanggal: new Date().toISOString().slice(0, 10),
    lokasi: "",
  });
  const inspection = reactive({
    asset_id: "",
    kondisi: "baik" as AssetKondisi,
    qty: 1,
    lokasi: "",
  });
  const newAsset = reactive({
    nama: "",
    kategori: "server_pc" as AssetKategori,
    kondisi: "baik" as AssetKondisi,
    qty: 1,
    lokasi: "",
  });
  const followForm = reactive({
    status: "open" as FollowUpStatus,
    pic: "",
    target: "",
  });

  const selectedPeriod = computed(() =>
    periods.value.find(
      (period) => period.periode_id === selectedPeriodId.value,
    ),
  );
  const assetMap = computed(
    () => new Map(assets.value.map((asset) => [asset.asset_id, asset])),
  );
  const filtered = computed(() =>
    records.value.filter((record) => {
      const asset = assetMap.value.get(record.asset_id);
      const matchesQuery =
        !query.value ||
        [asset?.nama_aset, asset?.no_inventaris, record.lokasi_aktual]
          .join(" ")
          .toLowerCase()
          .includes(query.value.toLowerCase());
      const matchesFinding =
        finding.value === "all" ||
        (finding.value === "open" &&
          record.status_temuan !== "sesuai" &&
          record.status_tindak_lanjut !== "selesai") ||
        record.status_temuan === finding.value;
      return matchesQuery && matchesFinding;
    }),
  );
  const findingCount = (status: FindingStatus) =>
    records.value.filter((record) => record.status_temuan === status).length;

  async function selectPeriod(id: string) {
    selectedPeriodId.value = id;
    recordsLoading.value = true;
    try {
      records.value = await opnameApi.records(id);
    } catch (cause) {
      error.value = errorMessage(cause);
    } finally {
      recordsLoading.value = false;
    }
  }
  async function load() {
    loading.value = true;
    try {
      [periods.value, assets.value] = await Promise.all([
        opnameApi.periods(),
        assetsApi.list(),
      ]);
      if (!selectedPeriodId.value && periods.value[0])
        await selectPeriod(periods.value[0].periode_id);
    } catch (cause) {
      error.value = errorMessage(cause, "Stock opname gagal dimuat.");
    } finally {
      loading.value = false;
    }
  }
  async function openPeriod() {
    busy.value = true;
    try {
      const period = await opnameApi.open({
        tanggal_mulai: periodForm.tanggal,
        ...(periodForm.lokasi ? { cakupan_lokasi: periodForm.lokasi } : {}),
      });
      periods.value = [period, ...periods.value];
      periodModal.value = false;
      await selectPeriod(period.periode_id);
      notice.value = "Periode opname berhasil dibuka.";
    } catch (cause) {
      error.value = errorMessage(cause);
    } finally {
      busy.value = false;
    }
  }
  async function closePeriod() {
    if (!selectedPeriod.value || !confirm("Tutup periode? Data akan dikunci."))
      return;
    try {
      const period = await opnameApi.close(selectedPeriod.value.periode_id);
      periods.value = periods.value.map((item) =>
        item.periode_id === period.periode_id ? period : item,
      );
      notice.value = "Periode berhasil ditutup.";
    } catch (cause) {
      error.value = errorMessage(cause);
    }
  }
  let searchTimer: number;
  function searchAssets() {
    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(async () => {
      if (!assetSearch.value.trim()) {
        searchResults.value = [];
        return;
      }
      try {
        searchResults.value = await opnameApi.search(assetSearch.value);
      } catch (cause) {
        error.value = errorMessage(cause);
      }
    }, 250);
  }
  async function inspect() {
    if (!selectedPeriodId.value) return;
    busy.value = true;
    try {
      const record = await opnameApi.inspect(selectedPeriodId.value, {
        asset_id: inspection.asset_id,
        kondisi_fisik: inspection.kondisi,
        qty_fisik: inspection.qty,
        ...(inspection.lokasi ? { lokasi_aktual: inspection.lokasi } : {}),
      });
      records.value = [record, ...records.value];
      inspectionModal.value = false;
      notice.value = record.work_order_id
        ? "Pemeriksaan disimpan dan Work Order dibuat."
        : "Pemeriksaan berhasil disimpan.";
    } catch (cause) {
      error.value = errorMessage(cause);
    } finally {
      busy.value = false;
    }
  }
  async function registerNew() {
    busy.value = true;
    try {
      const result = await opnameApi.newAsset(selectedPeriodId.value, {
        nama_aset: newAsset.nama,
        kategori: newAsset.kategori,
        kondisi_fisik: newAsset.kondisi,
        qty_fisik: newAsset.qty,
        ...(newAsset.lokasi ? { lokasi_aktual: newAsset.lokasi } : {}),
      });
      assets.value = [result.asset, ...assets.value];
      records.value = [result.record, ...records.value];
      inspectionModal.value = false;
      notice.value = "Aset baru tercatat sebagai draft.";
    } catch (cause) {
      error.value = errorMessage(cause);
    } finally {
      busy.value = false;
    }
  }
  function openFollow(record: StockOpnameRecord) {
    followRecord.value = record;
    Object.assign(followForm, {
      status: record.status_tindak_lanjut || "open",
      pic: record.pic_tindak_lanjut || "",
      target: record.target_selesai || "",
    });
  }
  async function saveFollow() {
    if (!followRecord.value) return;
    busy.value = true;
    try {
      const record = await opnameApi.follow(followRecord.value.record_id, {
        status_tindak_lanjut: followForm.status,
        ...(followForm.pic ? { pic_tindak_lanjut: followForm.pic } : {}),
        ...(followForm.target ? { target_selesai: followForm.target } : {}),
      });
      records.value = records.value.map((item) =>
        item.record_id === record.record_id ? record : item,
      );
      followRecord.value = null;
      notice.value = "Tindak lanjut berhasil diperbarui.";
    } catch (cause) {
      error.value = errorMessage(cause);
    } finally {
      busy.value = false;
    }
  }
  const short = (value: string) => value.slice(0, 8).toUpperCase();
  const date = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  onMounted(load);

  return {
    isLaboran,
    isHead,
    conditionLabel,
    findingLabel,
    followLabel,
    categoryLabel,
    periods,
    records,
    assets,
    selectedPeriodId,
    loading,
    recordsLoading,
    busy,
    error,
    notice,
    query,
    finding,
    periodModal,
    inspectionModal,
    inspectionTab,
    assetSearch,
    searchResults,
    followRecord,
    periodForm,
    inspection,
    newAsset,
    followForm,
    selectedPeriod,
    assetMap,
    filtered,
    findingCount,
    selectPeriod,
    openPeriod,
    closePeriod,
    searchAssets,
    inspect,
    registerNew,
    openFollow,
    saveFollow,
    short,
    date,
  };
}
