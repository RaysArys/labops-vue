import { HasilKalibrasi } from '../enums/calibration-status.enum';
export declare class InputPengukuranDto {
    parameter_id: string;
    nilai_aktual: number;
}
export declare class CatatHasilDto {
    tanggal_pelaksanaan: string;
    hasil?: HasilKalibrasi;
    pengukuran?: InputPengukuranDto[];
    deviasi?: string;
    biaya?: number;
    vendor_id?: string;
}
