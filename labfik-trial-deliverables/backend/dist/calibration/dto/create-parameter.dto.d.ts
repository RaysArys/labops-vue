import { AssetKategori } from '../../assets/enums/asset-status.enum';
export declare class CreateCalibrationParameterDto {
    kategori_aset: AssetKategori;
    kode: string;
    nama_parameter: string;
    satuan: string;
    batas_min?: number | null;
    batas_max?: number | null;
    aktif?: boolean;
}
