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
exports.StockOpnamePeriod = void 0;
const typeorm_1 = require("typeorm");
const stock_opname_enum_1 = require("./enums/stock-opname.enum");
let StockOpnamePeriod = class StockOpnamePeriod {
    periode_id;
    tanggal_mulai;
    tanggal_selesai;
    status;
    cakupan_lokasi;
    dibuat_oleh;
    created_at;
};
exports.StockOpnamePeriod = StockOpnamePeriod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockOpnamePeriod.prototype, "periode_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], StockOpnamePeriod.prototype, "tanggal_mulai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], StockOpnamePeriod.prototype, "tanggal_selesai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: stock_opname_enum_1.PeriodeStatus, default: stock_opname_enum_1.PeriodeStatus.AKTIF }),
    __metadata("design:type", String)
], StockOpnamePeriod.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockOpnamePeriod.prototype, "cakupan_lokasi", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockOpnamePeriod.prototype, "dibuat_oleh", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StockOpnamePeriod.prototype, "created_at", void 0);
exports.StockOpnamePeriod = StockOpnamePeriod = __decorate([
    (0, typeorm_1.Entity)('stock_opname_periods')
], StockOpnamePeriod);
//# sourceMappingURL=stock-opname-period.entity.js.map