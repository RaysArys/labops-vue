export type Role =
  "teknisi" | "laboran" | "kepala_lab" | "tata_usaha" | "wakil_dekan";
export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
  nama?: string;
}
export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export type AssetKategori =
  | "alat_ukur"
  | "jaringan"
  | "server_pc"
  | "iot_embedded"
  | "kelistrikan_ups"
  | "audio_visual"
  | "sparepart_bhp";
export type AssetKondisi =
  "baik" | "rusak" | "dalam_perbaikan" | "hilang" | "cadangan";
export type AssetStatus = "aktif" | "maintenance" | "dipinjam" | "dihapuskan";
export type ApprovalStatus =
  "draft" | "pending_approval" | "approved" | "rejected";
export type ApprovalAction = "ajukan" | "setujui" | "tolak" | "revisi";
export interface Asset {
  asset_id: string;
  nama_aset: string;
  kategori: AssetKategori;
  subkategori: string | null;
  merek: string | null;
  model: string | null;
  serial_number: string | null;
  no_inventaris: string | null;
  tahun_perolehan: number | null;
  qty_sistem: number;
  satuan: string | null;
  kondisi: AssetKondisi;
  status_aset: AssetStatus;
  criticality: string | null;
  gedung: string | null;
  lantai: string | null;
  ruangan: string | null;
  rak: string | null;
  pic_pengguna: string | null;
  unit_pemilik: string | null;
  supplier: string | null;
  contract_sla: string | null;
  foto: unknown | null;
  catatan: string | null;
  atribut_kategori: Record<string, unknown>;
  status_approval: ApprovalStatus;
  diajukan_oleh: string | null;
  disetujui_oleh: string | null;
  waktu_approval: string | null;
  organizational_unit_id: string;
  created_at: string;
  updated_at: string;
}
export interface AssetPayload {
  nama_aset: string;
  kategori: AssetKategori;
  subkategori?: string;
  merek?: string;
  model?: string;
  serial_number?: string;
  no_inventaris?: string;
  tahun_perolehan?: number;
  qty_sistem?: number;
  satuan?: string;
  gedung?: string;
  lantai?: string;
  ruangan?: string;
  rak?: string;
  pic_pengguna?: string;
  unit_pemilik?: string;
  atribut_kategori?: Record<string, unknown>;
}

export type WorkOrderSource = "manual" | "stock_opname" | "kalibrasi";
export type WorkOrderPriority = "rendah" | "sedang" | "tinggi" | "critical";
export type WorkOrderStatus =
  "open" | "in_progress" | "resolved" | "closed" | "cancelled";
export type WorkOrderAction =
  "mulai_kerjakan" | "selesaikan" | "buka_kembali" | "tutup" | "batalkan";
export interface WorkOrder {
  wo_id: string;
  asset_id: string;
  asal_temuan: WorkOrderSource;
  referensi_asal_id: string | null;
  deskripsi_kerusakan: string;
  status_tiket: WorkOrderStatus;
  prioritas: WorkOrderPriority;
  biaya: number | null;
  downtime_jam: number | null;
  catatan_perbaikan: string | null;
  dilaporkan_oleh: string;
  dikerjakan_oleh: string | null;
  diprioritaskan_oleh: string | null;
  waktu_selesai: string | null;
  created_at: string;
  updated_at: string;
}
export interface WorkOrder {
  laporan_ke_wadek: boolean;
  waktu_laporan_ke_wadek: string | null;
  dilaporkan_ke_wadek_oleh: string | null;
}
export interface DamageReport {
  nomor_laporan: string;
  dibuat_pada: string;
  asset: {
    asset_id: string;
    nama_aset: string;
    no_inventaris: string | null;
    kategori: AssetKategori;
    merek: string | null;
    model: string | null;
    serial_number: string | null;
    lokasi: string;
  };
  work_order: WorkOrder;
}

export type StockOpnamePeriodStatus = "aktif" | "selesai";
export type FindingStatus =
  "sesuai" | "tidak_sesuai" | "tidak_ditemukan" | "kelebihan_fisik";
export type FollowUpStatus = "open" | "in_progress" | "selesai";
export interface StockOpnamePeriod {
  periode_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  status: StockOpnamePeriodStatus;
  cakupan_lokasi: string | null;
  dibuat_oleh: string;
  created_at: string;
}
export interface StockOpnameRecord {
  record_id: string;
  periode_id: string;
  asset_id: string;
  kondisi_fisik: AssetKondisi;
  lokasi_aktual: string | null;
  qty_fisik: number;
  status_temuan: FindingStatus;
  pic_tindak_lanjut: string | null;
  target_selesai: string | null;
  status_tindak_lanjut: FollowUpStatus | null;
  work_order_id: string | null;
  dicatat_oleh: string;
  created_at: string;
  updated_at: string;
}

export type CalibrationScheduleStatus =
  "dijadwalkan" | "akan_jatuh_tempo" | "overdue" | "menunggu_perbaikan";
export type CalibrationResult = "lulus" | "lulus_bersyarat" | "tidak_lulus";
export type CalibrationLogStatus =
  "pending_approval" | "approved" | "rejected_dokumen" | "rejected_teknis";
export type CalibrationReviewAction =
  "setujui" | "tolak_dokumen" | "tolak_teknis" | "revisi";
export interface CalibrationSchedule {
  schedule_id: string;
  asset_id: string;
  interval_bulan: number;
  tanggal_kalibrasi_terakhir: string | null;
  tanggal_jatuh_tempo: string | null;
  status_kalibrasi: CalibrationScheduleStatus;
  created_at: string;
  updated_at: string;
}
export interface CalibrationLog {
  log_id: string;
  schedule_id: string;
  asset_id: string;
  vendor_id: string | null;
  tanggal_pelaksanaan: string;
  hasil: CalibrationResult;
  deviasi: string | null;
  biaya: number | null;
  sertifikat: unknown | null;
  status_approval: CalibrationLogStatus;
  dicatat_oleh: string;
  disetujui_oleh: string | null;
  waktu_approval: string | null;
  alasan_penolakan: string | null;
  work_order_id: string | null;
  created_at: string;
  updated_at: string;
}
export interface CalibrationParameter {
  parameter_id: string;
  kategori_aset: AssetKategori;
  kode: string;
  nama_parameter: string;
  satuan: string;
  batas_min: number | null;
  batas_max: number | null;
  aktif: boolean;
  dibuat_oleh: string;
  diubah_oleh: string | null;
  created_at: string;
  updated_at: string;
}
export interface CalibrationMeasurement {
  parameter_id: string;
  kode: string;
  nama_parameter: string;
  satuan: string;
  batas_min: number | null;
  batas_max: number | null;
  nilai_aktual: number;
  status: "normal" | "tidak_normal";
}
export interface CalibrationLog {
  pengukuran: CalibrationMeasurement[];
}
export interface CalibrationParameterPayload {
  kategori_aset: AssetKategori;
  kode: string;
  nama_parameter: string;
  satuan: string;
  batas_min?: number | null;
  batas_max?: number | null;
  aktif?: boolean;
}

export type VendorAccreditationStatus = "aktif" | "akan_expired" | "expired";
export interface Vendor {
  vendor_id: string;
  nama_vendor: string;
  kontak: string | null;
  no_akreditasi: string | null;
  tanggal_expired_akreditasi: string | null;
  status_akreditasi: VendorAccreditationStatus;
  dikelola_oleh: string;
  created_at: string;
  updated_at: string;
}
export interface DashboardResponse {
  cakupan_data: "full" | "terbatas";
  filter: Record<string, unknown>;
  kpi: {
    total_aset: number;
    aset_per_kategori: { label: string; total: number }[];
    kalibrasi_overdue: number;
    kalibrasi_akan_jatuh_tempo: number;
    temuan_stock_opname_belum_ditindaklanjuti: number;
    work_order_aktif: number;
    sertifikat_vendor_akan_expired: number;
  };
  grafik: {
    distribusi_aset: {
      per_kategori: { label: string; total: number }[];
      per_lokasi: { label: string; total: number }[];
      per_kondisi: { label: string; total: number }[];
    };
    tren_kalibrasi: { periode: string; total: number }[];
    biaya_maintenance: { periode: string; total: number }[];
  };
  perlu_perhatian: {
    aset_overdue_kalibrasi: Record<string, unknown>[];
    temuan_opname_open: Record<string, unknown>[];
    sertifikat_vendor_mendekati_expired: Record<string, unknown>[];
  };
}
