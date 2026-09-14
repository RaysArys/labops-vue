import { HasilKalibrasi, LogApprovalStatus } from './enums/calibration-status.enum';
import { CalibrationMeasurementSnapshot } from './calibration-measurement.types';
export declare class CalibrationLog {
    log_id: string;
    schedule_id: string;
    asset_id: string;
    vendor_id: string;
    tanggal_pelaksanaan: string;
    hasil: HasilKalibrasi;
    deviasi: string;
    pengukuran: CalibrationMeasurementSnapshot[];
    biaya: number | null;
    sertifikat: Buffer | null;
    status_approval: LogApprovalStatus;
    dicatat_oleh: string;
    disetujui_oleh: string;
    waktu_approval: Date | null;
    alasan_penolakan: string | null;
    work_order_id: string | null;
    created_at: Date;
    updated_at: Date;
}
