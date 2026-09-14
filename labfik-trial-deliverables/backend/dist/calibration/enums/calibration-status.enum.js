"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasilKalibrasi = exports.LogApprovalStatus = exports.JadwalStatus = void 0;
var JadwalStatus;
(function (JadwalStatus) {
    JadwalStatus["DIJADWALKAN"] = "dijadwalkan";
    JadwalStatus["AKAN_JATUH_TEMPO"] = "akan_jatuh_tempo";
    JadwalStatus["OVERDUE"] = "overdue";
    JadwalStatus["MENUNGGU_PERBAIKAN"] = "menunggu_perbaikan";
})(JadwalStatus || (exports.JadwalStatus = JadwalStatus = {}));
var LogApprovalStatus;
(function (LogApprovalStatus) {
    LogApprovalStatus["PENDING_APPROVAL"] = "pending_approval";
    LogApprovalStatus["APPROVED"] = "approved";
    LogApprovalStatus["REJECTED_DOKUMEN"] = "rejected_dokumen";
    LogApprovalStatus["REJECTED_TEKNIS"] = "rejected_teknis";
})(LogApprovalStatus || (exports.LogApprovalStatus = LogApprovalStatus = {}));
var HasilKalibrasi;
(function (HasilKalibrasi) {
    HasilKalibrasi["LULUS"] = "lulus";
    HasilKalibrasi["LULUS_BERSYARAT"] = "lulus_bersyarat";
    HasilKalibrasi["TIDAK_LULUS"] = "tidak_lulus";
})(HasilKalibrasi || (exports.HasilKalibrasi = HasilKalibrasi = {}));
//# sourceMappingURL=calibration-status.enum.js.map