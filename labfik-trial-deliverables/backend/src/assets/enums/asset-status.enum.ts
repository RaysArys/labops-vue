export enum AssetKategori {
  ALAT_UKUR = 'alat_ukur',
  JARINGAN = 'jaringan',
  SERVER_PC = 'server_pc',
  IOT_EMBEDDED = 'iot_embedded',
  KELISTRIKAN_UPS = 'kelistrikan_ups',
  AUDIO_VISUAL = 'audio_visual',
  SPAREPART_BHP = 'sparepart_bhp',
}

export enum AssetKondisi {
  BAIK = 'baik',
  RUSAK = 'rusak',
  DALAM_PERBAIKAN = 'dalam_perbaikan',
  HILANG = 'hilang',
  CADANGAN = 'cadangan',
}

export enum AssetStatus {
  AKTIF = 'aktif',
  MAINTENANCE = 'maintenance',
  DIPINJAM = 'dipinjam',
  DIHAPUSKAN = 'dihapuskan',
}

// State Machine A (lihat SRS bagian 4.2 / diskusi approval flow):
// DRAFT -> PENDING_APPROVAL -> APPROVED
//                            -> REJECTED -> (balik ke DRAFT untuk revisi)
export enum ApprovalStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
