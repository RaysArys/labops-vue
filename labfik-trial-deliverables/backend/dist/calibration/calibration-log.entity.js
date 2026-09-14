"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalibrationLog = void 0;
const typeorm_1 = require("typeorm");
const calibration_status_enum_1 = require("./enums/calibration-status.enum");
let CalibrationLog = class CalibrationLog {
    log_id;
    schedule_id;
    asset_id;
    vendor_id;
    tanggal_pelaksanaan;
    hasil;
    deviasi;
    pengukuran;
    biaya;
    sertifikat;
    status_approval;
    dicatat_oleh;
    disetujui_oleh;
    waktu_approval;
    alasan_penolakan;
    work_order_id;
    created_at;
    updated_at;
};
exports.CalibrationLog = CalibrationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CalibrationLog.prototype, "log_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalibrationLog.prototype, "schedule_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalibrationLog.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CalibrationLog.prototype, "vendor_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], CalibrationLog.prototype, "tanggal_pelaksanaan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: calibration_status_enum_1.HasilKalibrasi }),
    __metadata("design:type", String)
], CalibrationLog.prototype, "hasil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CalibrationLog.prototype, "deviasi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], CalibrationLog.prototype, "pengukuran", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Object)
], CalibrationLog.prototype, "biaya", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Object)
], CalibrationLog.prototype, "sertifikat", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: calibration_status_enum_1.LogApprovalStatus,
        default: calibration_status_enum_1.LogApprovalStatus.PENDING_APPROVAL,
    }),
    __metadata("design:type", String)
], CalibrationLog.prototype, "status_approval", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalibrationLog.prototype, "dicatat_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CalibrationLog.prototype, "disetujui_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], CalibrationLog.prototype, "waktu_approval", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CalibrationLog.prototype, "alasan_penolakan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], CalibrationLog.prototype, "work_order_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationLog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationLog.prototype, "updated_at", void 0);
exports.CalibrationLog = CalibrationLog = __decorate([
    (0, typeorm_1.Entity)('calibration_logs')
], CalibrationLog);
//# sourceMappingURL=calibration-log.entity.js.map