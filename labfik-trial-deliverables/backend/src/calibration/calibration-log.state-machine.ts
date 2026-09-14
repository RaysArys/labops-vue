import { BadRequestException } from '@nestjs/common';
import { LogApprovalStatus } from './enums/calibration-status.enum';

// State Machine Kalibrasi (CalibrationLog) — lihat SRS 4.2 & flow yang
// dirancang sebelumnya. Sama seperti state machine lain di project ini:
// manual enum + tabel transisi.
//
// Alur sah:
//   PENDING_APPROVAL -> APPROVED
//   PENDING_APPROVAL -> REJECTED_DOKUMEN
//   PENDING_APPROVAL -> REJECTED_TEKNIS
//   REJECTED_DOKUMEN -> PENDING_APPROVAL   (Laboran revisi pencatatan)
//
// REJECTED_TEKNIS TIDAK punya transisi lanjutan di state machine log ini —
// begitu masuk status ini, sistem membuat Work Order (lihat
// CalibrationService.tinjauHasil) dan siklus kalibrasi berikutnya dimulai
// dari CalibrationSchedule (bukan dari log yang sama) setelah Work Order
// ditutup. Log yang sudah REJECTED_TEKNIS dibiarkan sebagai catatan
// historis, bukan direvisi.
export type CalibrationLogAction = 'setujui' | 'tolak_dokumen' | 'tolak_teknis' | 'revisi';

const TRANSITIONS: Record<
  LogApprovalStatus,
  Partial<Record<CalibrationLogAction, LogApprovalStatus>>
> = {
  [LogApprovalStatus.PENDING_APPROVAL]: {
    setujui: LogApprovalStatus.APPROVED,
    tolak_dokumen: LogApprovalStatus.REJECTED_DOKUMEN,
    tolak_teknis: LogApprovalStatus.REJECTED_TEKNIS,
  },
  [LogApprovalStatus.REJECTED_DOKUMEN]: {
    revisi: LogApprovalStatus.PENDING_APPROVAL,
  },
  [LogApprovalStatus.APPROVED]: {}, // status akhir
  [LogApprovalStatus.REJECTED_TEKNIS]: {}, // status akhir untuk log ini (lihat catatan di atas)
};

export function transitionCalibrationLog(
  current: LogApprovalStatus,
  action: CalibrationLogAction,
): LogApprovalStatus {
  const next = TRANSITIONS[current]?.[action];
  if (!next) {
    throw new BadRequestException(
      `Transisi tidak valid: aksi "${action}" tidak bisa dilakukan dari status "${current}"`,
    );
  }
  return next;
}
