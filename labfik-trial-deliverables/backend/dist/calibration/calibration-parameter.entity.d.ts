import { AssetKategori } from '../assets/enums/asset-status.enum';
export declare class CalibrationParameter {
    parameter_id: string;
    kategori_aset: AssetKategori;
    kode: string;
    nama_parameter: string;
    satuan: string;
    batas_min: number | null;
    batas_max: number | null;
    aktif: boolean;
    dibuat_oleh: string;
    diubah_oleh: string | null;
    created_at: Date;
    updated_at: Date;
}
