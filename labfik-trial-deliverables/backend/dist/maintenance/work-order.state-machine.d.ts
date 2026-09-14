import { WorkOrderStatus } from './enums/work-order-status.enum';
export type WorkOrderAction = 'mulai_kerjakan' | 'selesaikan' | 'buka_kembali' | 'tutup' | 'batalkan';
export declare function transitionWorkOrder(current: WorkOrderStatus, action: WorkOrderAction): WorkOrderStatus;
