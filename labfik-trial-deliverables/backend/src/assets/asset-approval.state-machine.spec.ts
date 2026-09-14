import { BadRequestException } from '@nestjs/common';
import { transitionAssetApproval } from './asset-approval.state-machine';
import { ApprovalStatus } from './enums/asset-status.enum';

describe('Asset approval state machine', () => {
  it('menjalankan jalur draft sampai approved', () => {
    const pending = transitionAssetApproval(ApprovalStatus.DRAFT, 'ajukan');
    expect(pending).toBe(ApprovalStatus.PENDING_APPROVAL);
    expect(transitionAssetApproval(pending, 'setujui')).toBe(
      ApprovalStatus.APPROVED,
    );
  });

  it('menolak transisi langsung draft ke setujui', () => {
    expect(() =>
      transitionAssetApproval(ApprovalStatus.DRAFT, 'setujui'),
    ).toThrow(BadRequestException);
  });
});
