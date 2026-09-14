// State Machine Periode: AKTIF -> SELESAI (satu arah, tidak bisa dibuka lagi
// setelah ditutup — FR-09: data transaksi terkunci di luar periode aktif).
export enum PeriodeStatus {
  AKTIF = 'aktif',
  SELESAI = 'selesai',
}

// Hasil perbandingan otomatis data sistem vs data fisik (FR-10).
export enum StatusTemuan {
  SESUAI = 'sesuai',
  TIDAK_SESUAI = 'tidak_sesuai',
  TIDAK_DITEMUKAN = 'tidak_ditemukan',
  KELEBIHAN_FISIK = 'kelebihan_fisik',
}

// State Machine Tindak Lanjut (hanya relevan untuk StatusTemuan selain SESUAI):
// OPEN -> IN_PROGRESS -> SELESAI
export enum StatusTindakLanjut {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  SELESAI = 'selesai',
}

// Kondisi fisik yang dicatat Laboran saat pemeriksaan.
// Nilainya sama dengan AssetKondisi (lihat assets/enums/asset-status.enum.ts)
// supaya konsisten, tapi didefinisikan terpisah karena StockOpnameRecord
// tidak selalu mau mengubah kondisi resmi Asset secara langsung.
export enum KondisiFisik {
  BAIK = 'baik',
  RUSAK = 'rusak',
  DALAM_PERBAIKAN = 'dalam_perbaikan',
  HILANG = 'hilang',
  CADANGAN = 'cadangan',
}
