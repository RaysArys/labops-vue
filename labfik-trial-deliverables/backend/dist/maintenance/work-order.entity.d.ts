import { WorkOrderAsalTemuan, WorkOrderPrioritas, WorkOrderStatus } from './enums/work-order-status.enum';
export declare class WorkOrder {
    wo_id: string;
    asset_id: string;
    asal_temuan: WorkOrderAsalTemuan;
    referensi_asal_id: string;
    deskripsi_kerusakan: string;
    status_tiket: WorkOrderStatus;
    prioritas: WorkOrderPrioritas;
    biaya: number | null;
    downtime_jam: number | null;
    catatan_perbaikan: string | null;
    dilaporkan_oleh: string;
    dikerjakan_oleh: string;
    diprioritaskan_oleh: string;
    waktu_selesai: Date | null;
    laporan_ke_wadek: boolean;
    waktu_laporan_ke_wadek: Date | null;
    dilaporkan_ke_wadek_oleh: string | null;
    created_at: Date;
    updated_at: Date;
}
