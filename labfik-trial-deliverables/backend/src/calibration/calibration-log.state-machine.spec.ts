import { BadRequestException } from '@nestjs/common';
import { LogApprovalStatus } from './enums/calibration-status.enum';
import { transitionCalibrationLog } from './calibration-log.state-machine';

describe('Calibration log state machine', () => {
  it('mengembalikan dokumen ditolak ke antrean setelah revisi', () => {
    const rejected = transitionCalibrationLog(
      LogApprovalStatus.PENDING_APPROVAL,
      'tolak_dokumen',
    );
    expect(transitionCalibrationLog(rejected, 'revisi')).toBe(
      LogApprovalStatus.PENDING_APPROVAL,
    );
  });

  it('menjadikan approved sebagai status akhir', () => {
    expect(() =>
      transitionCalibrationLog(LogApprovalStatus.APPROVED, 'revisi'),
    ).toThrow(BadRequestException);
  });
});
