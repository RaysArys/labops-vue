// Asal temuan: dari mana tiket ini muncul — dipakai nanti saat Stock Opname
// dan Kalibrasi mengeskalasi otomatis (lihat rencana modul stock-opname &
// calibration: "Buat Work Order" pada Activity Diagram).
export enum WorkOrderAsalTemuan {
  MANUAL = 'manual', // Laboran lapor langsung
  STOCK_OPNAME = 'stock_opname',
  KALIBRASI = 'kalibrasi',
}

export enum WorkOrderPrioritas {
  RENDAH = 'rendah',
  SEDANG = 'sedang',
  TINGGI = 'tinggi',
  CRITICAL = 'critical',
}

// State Machine Maintenance:
//   Open -> In Progress -> Resolved -> Closed
//   Open/In Progress -> Cancelled (kalau ternyata tidak jadi diproses)
export enum WorkOrderStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}
