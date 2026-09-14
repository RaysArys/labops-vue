import { AssetKategori } from '../enums/asset-status.enum';
export declare class CreateAssetDto {
    nama_aset: string;
    kategori: AssetKategori;
    subkategori?: string;
    merek?: string;
    model?: string;
    serial_number?: string;
    no_inventaris?: string;
    tahun_perolehan?: number;
    qty_sistem?: number;
    satuan?: string;
    gedung?: string;
    lantai?: string;
    ruangan?: string;
    rak?: string;
    pic_pengguna?: string;
    unit_pemilik?: string;
    atribut_kategori?: Record<string, unknown>;
}
