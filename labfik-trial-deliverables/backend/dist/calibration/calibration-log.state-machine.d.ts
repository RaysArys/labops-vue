import { LogApprovalStatus } from './enums/calibration-status.enum';
export type CalibrationLogAction = 'setujui' | 'tolak_dokumen' | 'tolak_teknis' | 'revisi';
export declare function transitionCalibrationLog(current: LogApprovalStatus, action: CalibrationLogAction): LogApprovalStatus;
