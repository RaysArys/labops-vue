import { KondisiFisik, StatusTemuan, StatusTindakLanjut } from './enums/stock-opname.enum';
export declare class StockOpnameRecord {
    record_id: string;
    periode_id: string;
    asset_id: string;
    kondisi_fisik: KondisiFisik;
    lokasi_aktual: string;
    qty_fisik: number;
    status_temuan: StatusTemuan;
    pic_tindak_lanjut: string;
    target_selesai: string | null;
    status_tindak_lanjut: StatusTindakLanjut | null;
    work_order_id: string | null;
    dicatat_oleh: string;
    created_at: Date;
    updated_at: Date;
}
