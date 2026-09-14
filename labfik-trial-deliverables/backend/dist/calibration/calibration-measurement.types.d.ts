export type MeasurementStatus = 'normal' | 'tidak_normal';
export interface CalibrationMeasurementSnapshot {
    parameter_id: string;
    kode: string;
    nama_parameter: string;
    satuan: string;
    batas_min: number | null;
    batas_max: number | null;
    nilai_aktual: number;
    status: MeasurementStatus;
}
