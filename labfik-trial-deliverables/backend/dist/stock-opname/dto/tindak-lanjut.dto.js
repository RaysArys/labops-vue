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
exports.TindakLanjutDto = void 0;
const class_validator_1 = require("class-validator");
class TindakLanjutDto {
    pic_tindak_lanjut;
    target_selesai;
    status_tindak_lanjut;
}
exports.TindakLanjutDto = TindakLanjutDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TindakLanjutDto.prototype, "pic_tindak_lanjut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TindakLanjutDto.prototype, "target_selesai", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['open', 'in_progress', 'selesai']),
    __metadata("design:type", String)
], TindakLanjutDto.prototype, "status_tindak_lanjut", void 0);
//# sourceMappingURL=tindak-lanjut.dto.js.map