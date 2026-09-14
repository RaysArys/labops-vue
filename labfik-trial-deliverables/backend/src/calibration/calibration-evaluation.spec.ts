import { BadRequestException } from '@nestjs/common';
import { CalibrationParameter } from './calibration-parameter.entity';
import { evaluateMeasurement } from './calibration-evaluation';

const parameter = (overrides: Partial<CalibrationParameter>) =>
  ({
    parameter_id: 'parameter-1',
    kode: 'memory_idle',
    nama_parameter: 'Memory idle',
    satuan: '%',
    batas_min: null,
    batas_max: 20,
    aktif: true,
    ...overrides,
  }) as CalibrationParameter;

describe('evaluateMeasurement', () => {
  it('menilai batas maksimum secara inklusif', () => {
    expect(evaluateMeasurement(parameter({}), 20).status).toBe('normal');
    expect(evaluateMeasurement(parameter({}), 20.1).status).toBe(
      'tidak_normal',
    );
  });

  it('menilai rentang minimum dan maksimum', () => {
    const range = parameter({ batas_min: 10, batas_max: 45 });
    expect(evaluateMeasurement(range, 30).status).toBe('normal');
    expect(evaluateMeasurement(range, 8).status).toBe('tidak_normal');
  });

  it('menolak nilai bukan angka', () => {
    expect(() => evaluateMeasurement(parameter({}), Number.NaN)).toThrow(
      BadRequestException,
    );
  });
});
