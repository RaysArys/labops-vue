// Dihitung otomatis dari tanggal_expired_akreditasi, mirip pola
// JadwalStatus di modul Kalibrasi (FR-21: notifikasi menjelang expired).
export enum StatusAkreditasi {
  AKTIF = 'aktif',
  AKAN_EXPIRED = 'akan_expired',
  EXPIRED = 'expired',
}
