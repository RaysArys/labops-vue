import { CalibrationParameter } from './calibration-parameter.entity';
import { CalibrationMeasurementSnapshot } from './calibration-measurement.types';
export declare function evaluateMeasurement(parameter: CalibrationParameter, nilaiAktual: number): CalibrationMeasurementSnapshot;
