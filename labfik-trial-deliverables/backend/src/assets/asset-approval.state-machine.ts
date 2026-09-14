import { BadRequestException } from '@nestjs/common';
import { ApprovalStatus } from './enums/asset-status.enum';

// State Machine A — Approval Master Aset.
// Diimplementasikan manual (enum + tabel transisi), bukan pakai library
// seperti xstate, sesuai keputusan: cukup untuk kompleksitas approval
// linear satu-approver ini; upgrade ke xstate baru relevan kalau nanti
// approval-nya jadi multi-level/paralel.
//
// Alur sah:
//   DRAFT            -> PENDING_APPROVAL   (diajukan oleh Teknisi/Laboran/
//                                            Kepala Lab/Tata Usaha)
//   PENDING_APPROVAL -> APPROVED           (disetujui Wakil Dekan)
//   PENDING_APPROVAL -> REJECTED           (ditolak Wakil Dekan)
//   REJECTED         -> DRAFT              (direvisi ulang oleh pengaju)
export type AssetApprovalAction = 'ajukan' | 'setujui' | 'tolak' | 'revisi';

const TRANSITIONS: Record<ApprovalStatus, Partial<Record<AssetApprovalAction, ApprovalStatus>>> = {
  [ApprovalStatus.DRAFT]: {
    ajukan: ApprovalStatus.PENDING_APPROVAL,
  },
  [ApprovalStatus.PENDING_APPROVAL]: {
    setujui: ApprovalStatus.APPROVED,
    tolak: ApprovalStatus.REJECTED,
  },
  [ApprovalStatus.REJECTED]: {
    revisi: ApprovalStatus.DRAFT,
  },
  [ApprovalStatus.APPROVED]: {
    // Status akhir untuk siklus ini. Kalau nanti ada perubahan lagi
    // terhadap aset yang sudah APPROVED, itu dianggap pengajuan baru
    // (kembali ke DRAFT dari sisi service, bukan transisi dari state ini).
  },
};

// Lempar BadRequestException kalau transisi tidak sah, supaya controller/
// service pemanggil tidak perlu duplikasi validasi if-else.
export function transitionAssetApproval(
  current: ApprovalStatus,
  action: AssetApprovalAction,
): ApprovalStatus {
  const next = TRANSITIONS[current]?.[action];
  if (!next) {
    throw new BadRequestException(
      `Transisi tidak valid: aksi "${action}" tidak bisa dilakukan dari status "${current}"`,
    );
  }
  return next;
}
