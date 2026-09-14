"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionCalibrationLog = transitionCalibrationLog;
const common_1 = require("@nestjs/common");
const calibration_status_enum_1 = require("./enums/calibration-status.enum");
const TRANSITIONS = {
    [calibration_status_enum_1.LogApprovalStatus.PENDING_APPROVAL]: {
        setujui: calibration_status_enum_1.LogApprovalStatus.APPROVED,
        tolak_dokumen: calibration_status_enum_1.LogApprovalStatus.REJECTED_DOKUMEN,
        tolak_teknis: calibration_status_enum_1.LogApprovalStatus.REJECTED_TEKNIS,
    },
    [calibration_status_enum_1.LogApprovalStatus.REJECTED_DOKUMEN]: {
        revisi: calibration_status_enum_1.LogApprovalStatus.PENDING_APPROVAL,
    },
    [calibration_status_enum_1.LogApprovalStatus.APPROVED]: {},
    [calibration_status_enum_1.LogApprovalStatus.REJECTED_TEKNIS]: {},
};
function transitionCalibrationLog(current, action) {
    const next = TRANSITIONS[current]?.[action];
    if (!next) {
        throw new common_1.BadRequestException(`Transisi tidak valid: aksi "${action}" tidak bisa dilakukan dari status "${current}"`);
    }
    return next;
}
//# sourceMappingURL=calibration-log.state-machine.js.map