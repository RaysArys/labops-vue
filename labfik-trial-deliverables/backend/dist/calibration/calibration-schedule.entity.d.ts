import { JadwalStatus } from './enums/calibration-status.enum';
export declare class CalibrationSchedule {
    schedule_id: string;
    asset_id: string;
    interval_bulan: number;
    tanggal_kalibrasi_terakhir: string | null;
    tanggal_jatuh_tempo: string | null;
    status_kalibrasi: JadwalStatus;
    created_at: Date;
    updated_at: Date;
}
