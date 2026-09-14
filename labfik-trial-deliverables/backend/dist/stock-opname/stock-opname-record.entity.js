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
exports.StockOpnameRecord = void 0;
const typeorm_1 = require("typeorm");
const stock_opname_enum_1 = require("./enums/stock-opname.enum");
let StockOpnameRecord = class StockOpnameRecord {
    record_id;
    periode_id;
    asset_id;
    kondisi_fisik;
    lokasi_aktual;
    qty_fisik;
    status_temuan;
    pic_tindak_lanjut;
    target_selesai;
    status_tindak_lanjut;
    work_order_id;
    dicatat_oleh;
    created_at;
    updated_at;
};
exports.StockOpnameRecord = StockOpnameRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "record_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "periode_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: stock_opname_enum_1.KondisiFisik }),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "kondisi_fisik", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "lokasi_aktual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], StockOpnameRecord.prototype, "qty_fisik", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: stock_opname_enum_1.StatusTemuan }),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "status_temuan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "pic_tindak_lanjut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], StockOpnameRecord.prototype, "target_selesai", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: stock_opname_enum_1.StatusTindakLanjut,
        nullable: true,
    }),
    __metadata("design:type", Object)
], StockOpnameRecord.prototype, "status_tindak_lanjut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StockOpnameRecord.prototype, "work_order_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockOpnameRecord.prototype, "dicatat_oleh", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StockOpnameRecord.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StockOpnameRecord.prototype, "updated_at", void 0);
exports.StockOpnameRecord = StockOpnameRecord = __decorate([
    (0, typeorm_1.Entity)('stock_opname_records')
], StockOpnameRecord);
//# sourceMappingURL=stock-opname-record.entity.js.map