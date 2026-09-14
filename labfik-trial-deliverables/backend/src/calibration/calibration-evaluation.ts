import { BadRequestException } from '@nestjs/common';
import { CalibrationParameter } from './calibration-parameter.entity';
import { CalibrationMeasurementSnapshot } from './calibration-measurement.types';

export function evaluateMeasurement(
  parameter: CalibrationParameter,
  nilaiAktual: number,
): CalibrationMeasurementSnapshot {
  if (!Number.isFinite(nilaiAktual)) {
    throw new BadRequestException(
      `Nilai ${parameter.nama_parameter} harus berupa angka`,
    );
  }

  const memenuhiMin =
    parameter.batas_min === null || nilaiAktual >= parameter.batas_min;
  const memenuhiMax =
    parameter.batas_max === null || nilaiAktual <= parameter.batas_max;

  return {
    parameter_id: parameter.parameter_id,
    kode: parameter.kode,
    nama_parameter: parameter.nama_parameter,
    satuan: parameter.satuan,
    batas_min: parameter.batas_min,
    batas_max: parameter.batas_max,
    nilai_aktual: nilaiAktual,
    status: memenuhiMin && memenuhiMax ? 'normal' : 'tidak_normal',
  };
}
