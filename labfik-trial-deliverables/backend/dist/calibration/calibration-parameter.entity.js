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
exports.CalibrationParameter = void 0;
const typeorm_1 = require("typeorm");
const asset_status_enum_1 = require("../assets/enums/asset-status.enum");
let CalibrationParameter = class CalibrationParameter {
    parameter_id;
    kategori_aset;
    kode;
    nama_parameter;
    satuan;
    batas_min;
    batas_max;
    aktif;
    dibuat_oleh;
    diubah_oleh;
    created_at;
    updated_at;
};
exports.CalibrationParameter = CalibrationParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CalibrationParameter.prototype, "parameter_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CalibrationParameter.prototype, "kategori_aset", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60 }),
    __metadata("design:type", String)
], CalibrationParameter.prototype, "kode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 160 }),
    __metadata("design:type", String)
], CalibrationParameter.prototype, "nama_parameter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], CalibrationParameter.prototype, "satuan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Object)
], CalibrationParameter.prototype, "batas_min", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Object)
], CalibrationParameter.prototype, "batas_max", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CalibrationParameter.prototype, "aktif", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalibrationParameter.prototype, "dibuat_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], CalibrationParameter.prototype, "diubah_oleh", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationParameter.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CalibrationParameter.prototype, "updated_at", void 0);
exports.CalibrationParameter = CalibrationParameter = __decorate([
    (0, typeorm_1.Entity)('calibration_parameters'),
    (0, typeorm_1.Index)(['kategori_aset', 'kode'], { unique: true })
], CalibrationParameter);
//# sourceMappingURL=calibration-parameter.entity.js.map