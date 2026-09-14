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
exports.CalibrationSchedule = void 0;
const typeorm_1 = require("typeorm");
const calibration_status_enum_1 = require("./enums/calibration-status.enum");
let CalibrationSchedule = class CalibrationSchedule {
    schedule_id;
    asset_id;
    interval_bulan;
    tanggal_kalibrasi_terakhir;
    tanggal_jatuh_tempo;
    status_kalibrasi;
    created_at;
    updated_at;
};
exports.CalibrationSchedule = CalibrationSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CalibrationSchedule.prototype, "schedule_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalibrationSchedule.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CalibrationSchedule.prototype, "interval_bulan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], CalibrationSchedule.prototype, "tanggal_kalibrasi_terakhir", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], CalibrationSchedule.prototype, "tanggal_jatuh_tempo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: calibration_status_enum_1.JadwalStatus,
        default: calibration_status_enum_1.JadwalStatus.DIJADWALKAN,
    }),
    __metadata("design:type", String)
], CalibrationSchedule.prototype, "status_kalibrasi", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationSchedule.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationSchedule.prototype, "updated_at", void 0);
exports.CalibrationSchedule = CalibrationSchedule = __decorate([
    (0, typeorm_1.Entity)('calibration_schedules')
], CalibrationSchedule);
//# sourceMappingURL=calibration-schedule.entity.js.map