import { PeriodeStatus } from './enums/stock-opname.enum';
export declare class StockOpnamePeriod {
    periode_id: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    status: PeriodeStatus;
    cakupan_lokasi: string;
    dibuat_oleh: string;
    created_at: Date;
}
