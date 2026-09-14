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
exports.CatatHasilDto = exports.InputPengukuranDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const calibration_status_enum_1 = require("../enums/calibration-status.enum");
class InputPengukuranDto {
    parameter_id;
    nilai_aktual;
}
exports.InputPengukuranDto = InputPengukuranDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InputPengukuranDto.prototype, "parameter_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InputPengukuranDto.prototype, "nilai_aktual", void 0);
class CatatHasilDto {
    tanggal_pelaksanaan;
    hasil;
    pengukuran;
    deviasi;
    biaya;
    vendor_id;
}
exports.CatatHasilDto = CatatHasilDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CatatHasilDto.prototype, "tanggal_pelaksanaan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(calibration_status_enum_1.HasilKalibrasi),
    __metadata("design:type", String)
], CatatHasilDto.prototype, "hasil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)((item) => item.parameter_id),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InputPengukuranDto),
    __metadata("design:type", Array)
], CatatHasilDto.prototype, "pengukuran", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CatatHasilDto.prototype, "deviasi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CatatHasilDto.prototype, "biaya", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CatatHasilDto.prototype, "vendor_id", void 0);
//# sourceMappingURL=catat-hasil.dto.js.map