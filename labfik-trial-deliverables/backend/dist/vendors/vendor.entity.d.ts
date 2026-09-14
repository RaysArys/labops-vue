import { StatusAkreditasi } from './enums/status-akreditasi.enum';
export declare class Vendor {
    vendor_id: string;
    nama_vendor: string;
    kontak: string;
    no_akreditasi: string;
    tanggal_expired_akreditasi: string | null;
    status_akreditasi: StatusAkreditasi;
    dikelola_oleh: string;
    created_at: Date;
    updated_at: Date;
}
