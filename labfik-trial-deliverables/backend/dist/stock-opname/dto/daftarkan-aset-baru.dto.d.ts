import { AssetKategori } from '../../assets/enums/asset-status.enum';
import { KondisiFisik } from '../enums/stock-opname.enum';
export declare class DaftarkanAsetBaruDto {
    nama_aset: string;
    kategori: AssetKategori;
    lokasi_aktual?: string;
    kondisi_fisik: KondisiFisik;
    qty_fisik: number;
}
