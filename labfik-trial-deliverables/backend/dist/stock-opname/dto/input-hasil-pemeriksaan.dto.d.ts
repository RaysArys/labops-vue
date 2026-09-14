import { KondisiFisik } from '../enums/stock-opname.enum';
export declare class InputHasilPemeriksaanDto {
    asset_id: string;
    kondisi_fisik: KondisiFisik;
    lokasi_aktual?: string;
    qty_fisik: number;
}
