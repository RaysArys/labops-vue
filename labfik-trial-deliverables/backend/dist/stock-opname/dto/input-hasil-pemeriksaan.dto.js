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
exports.InputHasilPemeriksaanDto = void 0;
const class_validator_1 = require("class-validator");
const stock_opname_enum_1 = require("../enums/stock-opname.enum");
class InputHasilPemeriksaanDto {
    asset_id;
    kondisi_fisik;
    lokasi_aktual;
    qty_fisik;
}
exports.InputHasilPemeriksaanDto = InputHasilPemeriksaanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InputHasilPemeriksaanDto.prototype, "asset_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(stock_opname_enum_1.KondisiFisik),
    __metadata("design:type", String)
], InputHasilPemeriksaanDto.prototype, "kondisi_fisik", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InputHasilPemeriksaanDto.prototype, "lokasi_aktual", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InputHasilPemeriksaanDto.prototype, "qty_fisik", void 0);
//# sourceMappingURL=input-hasil-pemeriksaan.dto.js.map