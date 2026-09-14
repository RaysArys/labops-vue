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
exports.Asset = void 0;
const typeorm_1 = require("typeorm");
const asset_status_enum_1 = require("./enums/asset-status.enum");
let Asset = class Asset {
    asset_id;
    nama_aset;
    kategori;
    subkategori;
    merek;
    model;
    serial_number;
    no_inventaris;
    tahun_perolehan;
    qty_sistem;
    satuan;
    kondisi;
    status_aset;
    criticality;
    gedung;
    lantai;
    ruangan;
    rak;
    pic_pengguna;
    unit_pemilik;
    supplier;
    contract_sla;
    foto;
    catatan;
    atribut_kategori;
    status_approval;
    diajukan_oleh;
    disetujui_oleh;
    waktu_approval;
    organizational_unit_id;
    created_at;
    updated_at;
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Asset.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "nama_aset", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: asset_status_enum_1.AssetKategori }),
    __metadata("design:type", String)
], Asset.prototype, "kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "subkategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "merek", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "serial_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "no_inventaris", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Asset.prototype, "tahun_perolehan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 1 }),
    __metadata("design:type", Number)
], Asset.prototype, "qty_sistem", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "satuan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: asset_status_enum_1.AssetKondisi, default: asset_status_enum_1.AssetKondisi.BAIK }),
    __metadata("design:type", String)
], Asset.prototype, "kondisi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: asset_status_enum_1.AssetStatus, default: asset_status_enum_1.AssetStatus.AKTIF }),
    __metadata("design:type", String)
], Asset.prototype, "status_aset", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "criticality", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "gedung", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "lantai", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "ruangan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "rak", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "pic_pengguna", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "unit_pemilik", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "contract_sla", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', nullable: true }),
    __metadata("design:type", Object)
], Asset.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "catatan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Asset.prototype, "atribut_kategori", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: asset_status_enum_1.ApprovalStatus, default: asset_status_enum_1.ApprovalStatus.DRAFT }),
    __metadata("design:type", String)
], Asset.prototype, "status_approval", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "diajukan_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "disetujui_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Asset.prototype, "waktu_approval", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'FIK' }),
    __metadata("design:type", String)
], Asset.prototype, "organizational_unit_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Asset.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Asset.prototype, "updated_at", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)('assets')
], Asset);
//# sourceMappingURL=asset.entity.js.map