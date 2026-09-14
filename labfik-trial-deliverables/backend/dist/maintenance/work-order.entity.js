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
exports.WorkOrder = void 0;
const typeorm_1 = require("typeorm");
const work_order_status_enum_1 = require("./enums/work-order-status.enum");
let WorkOrder = class WorkOrder {
    wo_id;
    asset_id;
    asal_temuan;
    referensi_asal_id;
    deskripsi_kerusakan;
    status_tiket;
    prioritas;
    biaya;
    downtime_jam;
    catatan_perbaikan;
    dilaporkan_oleh;
    dikerjakan_oleh;
    diprioritaskan_oleh;
    waktu_selesai;
    laporan_ke_wadek;
    waktu_laporan_ke_wadek;
    dilaporkan_ke_wadek_oleh;
    created_at;
    updated_at;
};
exports.WorkOrder = WorkOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkOrder.prototype, "wo_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkOrder.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: work_order_status_enum_1.WorkOrderAsalTemuan,
        default: work_order_status_enum_1.WorkOrderAsalTemuan.MANUAL,
    }),
    __metadata("design:type", String)
], WorkOrder.prototype, "asal_temuan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "referensi_asal_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WorkOrder.prototype, "deskripsi_kerusakan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: work_order_status_enum_1.WorkOrderStatus, default: work_order_status_enum_1.WorkOrderStatus.OPEN }),
    __metadata("design:type", String)
], WorkOrder.prototype, "status_tiket", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: work_order_status_enum_1.WorkOrderPrioritas,
        default: work_order_status_enum_1.WorkOrderPrioritas.SEDANG,
    }),
    __metadata("design:type", String)
], WorkOrder.prototype, "prioritas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "biaya", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "downtime_jam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "catatan_perbaikan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkOrder.prototype, "dilaporkan_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "dikerjakan_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WorkOrder.prototype, "diprioritaskan_oleh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "waktu_selesai", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], WorkOrder.prototype, "laporan_ke_wadek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "waktu_laporan_ke_wadek", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], WorkOrder.prototype, "dilaporkan_ke_wadek_oleh", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkOrder.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WorkOrder.prototype, "updated_at", void 0);
exports.WorkOrder = WorkOrder = __decorate([
    (0, typeorm_1.Entity)('work_orders')
], WorkOrder);
//# sourceMappingURL=work-order.entity.js.map