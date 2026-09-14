import { BadRequestException } from '@nestjs/common';
import { WorkOrderStatus } from './enums/work-order-status.enum';

// State Machine Maintenance (lihat SRS bagian 3.4 / Activity Diagram Maintenance).
// Sama seperti asset-approval.state-machine.ts: manual enum + tabel transisi,
// bukan library eksternal, karena alurnya masih linear per tiket.
//
// Alur sah:
//   OPEN         -> IN_PROGRESS   (Teknisi mulai kerjakan)
//   OPEN         -> CANCELLED     (ternyata tidak jadi diproses)
//   IN_PROGRESS  -> RESOLVED      (Teknisi selesai perbaiki)
//   IN_PROGRESS  -> CANCELLED
//   RESOLVED     -> CLOSED        (dikonfirmasi selesai, mis. oleh pelapor/Kepala Lab)
//   RESOLVED     -> IN_PROGRESS   (ternyata belum benar-benar selesai, dibuka lagi)
export type WorkOrderAction =
  | 'mulai_kerjakan'
  | 'selesaikan'
  | 'buka_kembali'
  | 'tutup'
  | 'batalkan';

const TRANSITIONS: Record<
  WorkOrderStatus,
  Partial<Record<WorkOrderAction, WorkOrderStatus>>
> = {
  [WorkOrderStatus.OPEN]: {
    mulai_kerjakan: WorkOrderStatus.IN_PROGRESS,
    batalkan: WorkOrderStatus.CANCELLED,
  },
  [WorkOrderStatus.IN_PROGRESS]: {
    selesaikan: WorkOrderStatus.RESOLVED,
    batalkan: WorkOrderStatus.CANCELLED,
  },
  [WorkOrderStatus.RESOLVED]: {
    tutup: WorkOrderStatus.CLOSED,
    buka_kembali: WorkOrderStatus.IN_PROGRESS,
  },
  [WorkOrderStatus.CLOSED]: {}, // status akhir
  [WorkOrderStatus.CANCELLED]: {}, // status akhir
};

export function transitionWorkOrder(
  current: WorkOrderStatus,
  action: WorkOrderAction,
): WorkOrderStatus {
  const next = TRANSITIONS[current]?.[action];
  if (!next) {
    throw new BadRequestException(
      `Transisi tidak valid: aksi "${action}" tidak bisa dilakukan dari status "${current}"`,
    );
  }
  return next;
}
