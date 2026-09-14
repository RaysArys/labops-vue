export declare class TransitionWorkOrderDto {
    action: 'mulai_kerjakan' | 'selesaikan' | 'buka_kembali' | 'tutup' | 'batalkan';
    catatan_perbaikan?: string;
    biaya?: number;
    downtime_jam?: number;
}
