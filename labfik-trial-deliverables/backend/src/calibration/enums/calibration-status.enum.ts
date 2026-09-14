// Status jadwal (CalibrationSchedule) — siklikal, dihitung otomatis dari
// interval kalibrasi + tanggal kalibrasi terakhir (FR-12, FR-13).
export enum JadwalStatus {
  DIJADWALKAN = 'dijadwalkan',
  AKAN_JATUH_TEMPO = 'akan_jatuh_tempo',
  OVERDUE = 'overdue',
  MENUNGGU_PERBAIKAN = 'menunggu_perbaikan', // dipakai saat reject-teknis (lihat state machine)
}

// State Machine Approval Kalibrasi (CalibrationLog) — lihat SRS 4.2 &
// diskusi flow sebelumnya. Dua cabang reject yang berbeda tujuan:
//   PENDING_APPROVAL -> APPROVED
//   PENDING_APPROVAL -> REJECTED_DOKUMEN   -> (revisi Laboran) -> PENDING_APPROVAL
//   PENDING_APPROVAL -> REJECTED_TEKNIS    -> (Work Order ke Teknisi)
export enum LogApprovalStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED_DOKUMEN = 'rejected_dokumen',
  REJECTED_TEKNIS = 'rejected_teknis',
}

export enum HasilKalibrasi {
  LULUS = 'lulus',
  LULUS_BERSYARAT = 'lulus_bersyarat',
  TIDAK_LULUS = 'tidak_lulus',
}
