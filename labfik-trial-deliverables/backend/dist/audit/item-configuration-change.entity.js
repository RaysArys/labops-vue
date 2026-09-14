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
exports.ItemConfigurationChange = void 0;
const typeorm_1 = require("typeorm");
let ItemConfigurationChange = class ItemConfigurationChange {
    icc_id;
    entity_type;
    entity_id;
    field_name;
    field_lama;
    field_baru;
    diubah_oleh;
    alasan;
    waktu_perubahan;
};
exports.ItemConfigurationChange = ItemConfigurationChange;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ItemConfigurationChange.prototype, "icc_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ItemConfigurationChange.prototype, "entity_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ItemConfigurationChange.prototype, "entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ItemConfigurationChange.prototype, "field_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ItemConfigurationChange.prototype, "field_lama", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ItemConfigurationChange.prototype, "field_baru", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ItemConfigurationChange.prototype, "diubah_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ItemConfigurationChange.prototype, "alasan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ItemConfigurationChange.prototype, "waktu_perubahan", void 0);
exports.ItemConfigurationChange = ItemConfigurationChange = __decorate([
    (0, typeorm_1.Entity)('item_configuration_changes')
], ItemConfigurationChange);
//# sourceMappingURL=item-configuration-change.entity.js.map