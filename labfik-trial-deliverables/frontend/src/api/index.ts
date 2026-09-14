import { api } from "./client";
import type * as T from "../types";
export const assetsApi = {
  list: async () => (await api.get<T.Asset[]>("/assets")).data,
  create: async (p: T.AssetPayload) =>
    (await api.post<T.Asset>("/assets", p)).data,
  update: async (id: string, p: T.AssetPayload) =>
    (await api.patch<T.Asset>(`/assets/${id}`, p)).data,
  approval: async (id: string, action: T.ApprovalAction, alasan?: string) =>
    (
      await api.patch<T.Asset>(`/assets/${id}/approval`, {
        action,
        ...(alasan ? { alasan } : {}),
      })
    ).data,
};
export const dashboardApi = {
  get: async () => (await api.get<T.DashboardResponse>("/dashboard")).data,
};
export const woApi = {
  list: async () => (await api.get<T.WorkOrder[]>("/work-orders")).data,
  transition: async (
    id: string,
    p: {
      action: T.WorkOrderAction;
      catatan_perbaikan?: string;
      biaya?: number;
      downtime_jam?: number;
    },
  ) => (await api.patch<T.WorkOrder>(`/work-orders/${id}/status`, p)).data,
  priority: async (id: string, prioritas: T.WorkOrderPriority) =>
    (
      await api.patch<T.WorkOrder>(`/work-orders/${id}/prioritas`, {
        prioritas,
      })
    ).data,
  report: async (id: string) =>
    (await api.get<T.DamageReport>(`/work-orders/${id}/laporan-kerusakan`))
      .data,
  markWadek: async (id: string, dikirim: boolean) =>
    (
      await api.patch<T.WorkOrder>(`/work-orders/${id}/laporan-wadek`, {
        dikirim,
      })
    ).data,
};
export const opnameApi = {
  periods: async () =>
    (await api.get<T.StockOpnamePeriod[]>("/stock-opname/periode")).data,
  open: async (p: { tanggal_mulai: string; cakupan_lokasi?: string }) =>
    (await api.post<T.StockOpnamePeriod>("/stock-opname/periode", p)).data,
  close: async (id: string) =>
    (await api.patch<T.StockOpnamePeriod>(`/stock-opname/periode/${id}/tutup`))
      .data,
  records: async (id: string) =>
    (
      await api.get<T.StockOpnameRecord[]>(
        `/stock-opname/periode/${id}/records`,
      )
    ).data,
  search: async (q: string) =>
    (await api.get<T.Asset[]>("/stock-opname/search-asset", { params: { q } }))
      .data,
  inspect: async (
    id: string,
    p: {
      asset_id: string;
      kondisi_fisik: T.AssetKondisi;
      lokasi_aktual?: string;
      qty_fisik: number;
    },
  ) =>
    (
      await api.post<T.StockOpnameRecord>(
        `/stock-opname/periode/${id}/pemeriksaan`,
        p,
      )
    ).data,
  newAsset: async (
    id: string,
    p: {
      nama_aset: string;
      kategori: T.AssetKategori;
      lokasi_aktual?: string;
      kondisi_fisik: T.AssetKondisi;
      qty_fisik: number;
    },
  ) => (await api.post(`/stock-opname/periode/${id}/aset-baru`, p)).data,
  follow: async (
    id: string,
    p: {
      pic_tindak_lanjut?: string;
      target_selesai?: string;
      status_tindak_lanjut: T.FollowUpStatus;
    },
  ) =>
    (
      await api.patch<T.StockOpnameRecord>(
        `/stock-opname/records/${id}/tindak-lanjut`,
        p,
      )
    ).data,
};
export const calibrationApi = {
  schedules: async () =>
    (await api.get<T.CalibrationSchedule[]>("/calibration/schedules")).data,
  create: async (p: {
    asset_id: string;
    interval_bulan: number;
    tanggal_kalibrasi_terakhir?: string;
  }) =>
    (await api.post<T.CalibrationSchedule>("/calibration/schedules", p)).data,
  logs: async (id: string) =>
    (await api.get<T.CalibrationLog[]>(`/calibration/schedules/${id}/logs`))
      .data,
  record: async (
    id: string,
    p: {
      tanggal_pelaksanaan: string;
      hasil?: T.CalibrationResult;
      pengukuran?: { parameter_id: string; nilai_aktual: number }[];
      deviasi?: string;
      biaya?: number;
      vendor_id?: string;
    },
  ) =>
    (
      await api.post<T.CalibrationLog>(
        `/calibration/schedules/${id}/catat-hasil`,
        p,
      )
    ).data,
  review: async (
    id: string,
    action: T.CalibrationReviewAction,
    alasan?: string,
  ) =>
    (
      await api.patch<T.CalibrationLog>(`/calibration/logs/${id}/tinjau`, {
        action,
        ...(alasan ? { alasan } : {}),
      })
    ).data,
  refresh: async (id: string) =>
    (
      await api.patch<T.CalibrationSchedule>(
        `/calibration/schedules/${id}/refresh-status`,
      )
    ).data,
  repair: async (id: string) =>
    (
      await api.patch<T.CalibrationSchedule>(
        `/calibration/schedules/${id}/selesaikan-perbaikan`,
      )
    ).data,
  parameters: async (kategori?: T.AssetKategori, includeInactive = false) =>
    (
      await api.get<T.CalibrationParameter[]>("/calibration/parameters", {
        params: {
          ...(kategori ? { kategori } : {}),
          include_inactive: includeInactive,
        },
      })
    ).data,
  createParameter: async (p: T.CalibrationParameterPayload) =>
    (await api.post<T.CalibrationParameter>("/calibration/parameters", p)).data,
  updateParameter: async (
    id: string,
    p: Partial<T.CalibrationParameterPayload>,
  ) =>
    (
      await api.patch<T.CalibrationParameter>(
        `/calibration/parameters/${id}`,
        p,
      )
    ).data,
};
export const vendorsApi = {
  list: async () => (await api.get<T.Vendor[]>("/vendors")).data,
  create: async (p: {
    nama_vendor: string;
    kontak?: string;
    no_akreditasi?: string;
    tanggal_expired_akreditasi?: string;
  }) => (await api.post<T.Vendor>("/vendors", p)).data,
  update: async (id: string, p: any) =>
    (await api.patch<T.Vendor>(`/vendors/${id}`, p)).data,
  refresh: async (id: string) =>
    (await api.patch<T.Vendor>(`/vendors/${id}/refresh-status`)).data,
};
export const usersApi = {
  create: async (p: {
    nama: string;
    email: string;
    password: string;
    role: T.Role;
  }) => (await api.post("/users", p)).data,
};
