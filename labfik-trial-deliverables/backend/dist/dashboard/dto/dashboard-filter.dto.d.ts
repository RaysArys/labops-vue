import { AssetKategori } from '../../assets/enums/asset-status.enum';
export declare class DashboardFilterDto {
    gedung?: string;
    lantai?: string;
    ruangan?: string;
    kategori?: AssetKategori;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
}
