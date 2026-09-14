import { computed, onMounted, ref } from "vue";
import { dashboardApi } from "../api";
import { errorMessage } from "../api/client";
import type { DashboardResponse } from "../types";

export function useDashboard() {
  const data = ref<DashboardResponse | null>(null);
  const error = ref("");

  const categories = computed(
    () => data.value?.grafik.distribusi_aset.per_kategori.slice(0, 6) ?? [],
  );
  const maxCategoryTotal = computed(() =>
    Math.max(1, ...categories.value.map((item) => item.total)),
  );
  const attention = computed(() => {
    if (!data.value) return [];
    return [
      ...data.value.perlu_perhatian.aset_overdue_kalibrasi,
      ...data.value.perlu_perhatian.temuan_opname_open,
      ...data.value.perlu_perhatian.sertifikat_vendor_mendekati_expired,
    ].slice(0, 5);
  });

  const values = computed(() => {
    if (!data.value) return [0, 0, 0, 0, 0, 0];
    const { kpi } = data.value;
    return [
      kpi.total_aset,
      kpi.kalibrasi_overdue,
      kpi.kalibrasi_akan_jatuh_tempo,
      kpi.temuan_stock_opname_belum_ditindaklanjuti,
      kpi.work_order_aktif,
      kpi.sertifikat_vendor_akan_expired,
    ];
  });

  async function load() {
    try {
      data.value = await dashboardApi.get();
    } catch (cause) {
      error.value = errorMessage(cause, "Dashboard belum dapat dimuat.");
    }
  }

  onMounted(load);

  return { data, error, categories, maxCategoryTotal, attention, values };
}
