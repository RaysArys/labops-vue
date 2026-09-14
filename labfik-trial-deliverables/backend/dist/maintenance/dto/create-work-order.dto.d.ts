import { WorkOrderAsalTemuan } from '../enums/work-order-status.enum';
export declare class CreateWorkOrderDto {
    asset_id: string;
    deskripsi_kerusakan: string;
    asal_temuan?: WorkOrderAsalTemuan;
    referensi_asal_id?: string;
}
