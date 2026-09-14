import { BadRequestException } from '@nestjs/common';
import { WorkOrderStatus } from './enums/work-order-status.enum';
import { transitionWorkOrder } from './work-order.state-machine';

describe('Work order state machine', () => {
  it('menjalankan siklus penanganan sampai closed', () => {
    const inProgress = transitionWorkOrder(
      WorkOrderStatus.OPEN,
      'mulai_kerjakan',
    );
    const resolved = transitionWorkOrder(inProgress, 'selesaikan');
    expect(transitionWorkOrder(resolved, 'tutup')).toBe(
      WorkOrderStatus.CLOSED,
    );
  });

  it('menolak membuka kembali tiket yang sudah closed', () => {
    expect(() =>
      transitionWorkOrder(WorkOrderStatus.CLOSED, 'buka_kembali'),
    ).toThrow(BadRequestException);
  });
});
