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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const work_order_status_enum_1 = require("./enums/work-order-status.enum");
const work_order_state_machine_1 = require("./work-order.state-machine");
const audit_service_1 = require("../audit/audit.service");
const role_enum_1 = require("../common/enums/role.enum");
const assets_service_1 = require("../assets/assets.service");
let MaintenanceService = class MaintenanceService {
    repo;
    auditService;
    assetsService;
    constructor(repo, auditService, assetsService) {
        this.repo = repo;
        this.auditService = auditService;
        this.assetsService = assetsService;
    }
    async findAll(user) {
        return this.repo.find({
            where: user?.role === role_enum_1.Role.WAKIL_DEKAN ? { laporan_ke_wadek: true } : {},
            order: { created_at: 'DESC' },
        });
    }
    async findOne(woId, user) {
        const wo = await this.repo.findOne({ where: { wo_id: woId } });
        if (!wo)
            throw new common_1.NotFoundException(`Work Order ${woId} tidak ditemukan`);
        if (user?.role === role_enum_1.Role.WAKIL_DEKAN && !wo.laporan_ke_wadek) {
            throw new common_1.ForbiddenException('Laporan Work Order ini belum dikirim ke Wakil Dekan');
        }
        return wo;
    }
    async create(dto, user) {
        const wo = this.repo.create({
            asset_id: dto.asset_id,
            deskripsi_kerusakan: dto.deskripsi_kerusakan,
            asal_temuan: dto.asal_temuan ?? work_order_status_enum_1.WorkOrderAsalTemuan.MANUAL,
            referensi_asal_id: dto.referensi_asal_id,
            dilaporkan_oleh: user.userId,
            status_tiket: work_order_status_enum_1.WorkOrderStatus.OPEN,
        });
        const saved = await this.repo.save(wo);
        await this.auditService.logChange({
            entityType: 'WorkOrder',
            entityId: saved.wo_id,
            fieldName: 'status_tiket',
            fieldLama: null,
            fieldBaru: work_order_status_enum_1.WorkOrderStatus.OPEN,
            diubahOleh: user.userId,
        });
        return saved;
    }
    async createFromEscalation(params) {
        const wo = this.repo.create({
            asset_id: params.assetId,
            deskripsi_kerusakan: params.deskripsi,
            asal_temuan: params.asalTemuan,
            referensi_asal_id: params.referensiAsalId,
            dilaporkan_oleh: params.dilaporkanOleh,
            status_tiket: work_order_status_enum_1.WorkOrderStatus.OPEN,
        });
        const saved = await this.repo.save(wo);
        await this.auditService.logChange({
            entityType: 'WorkOrder',
            entityId: saved.wo_id,
            fieldName: 'status_tiket',
            fieldLama: null,
            fieldBaru: work_order_status_enum_1.WorkOrderStatus.OPEN,
            diubahOleh: params.dilaporkanOleh,
            alasan: `Eskalasi otomatis dari ${params.asalTemuan}`,
        });
        return saved;
    }
    async transitionStatus(woId, action, user, extra) {
        if (['mulai_kerjakan', 'selesaikan', 'buka_kembali', 'batalkan'].includes(action) &&
            user.role !== role_enum_1.Role.TEKNISI) {
            throw new common_1.ForbiddenException('Hanya Teknisi yang dapat mengubah status pengerjaan Work Order');
        }
        if (action === 'tutup' &&
            user.role !== role_enum_1.Role.TEKNISI &&
            user.role !== role_enum_1.Role.KEPALA_LAB) {
            throw new common_1.ForbiddenException('Hanya Teknisi atau Kepala Lab yang dapat menutup Work Order');
        }
        const wo = await this.findOne(woId);
        const statusLama = wo.status_tiket;
        wo.status_tiket = (0, work_order_state_machine_1.transitionWorkOrder)(statusLama, action);
        if (action === 'mulai_kerjakan') {
            wo.dikerjakan_oleh = user.userId;
        }
        if (action === 'selesaikan') {
            wo.catatan_perbaikan = extra.catatan_perbaikan ?? wo.catatan_perbaikan;
            wo.biaya = extra.biaya ?? wo.biaya;
            wo.downtime_jam = extra.downtime_jam ?? wo.downtime_jam;
            wo.waktu_selesai = new Date();
        }
        const saved = await this.repo.save(wo);
        await this.auditService.logChange({
            entityType: 'WorkOrder',
            entityId: woId,
            fieldName: 'status_tiket',
            fieldLama: statusLama,
            fieldBaru: saved.status_tiket,
            diubahOleh: user.userId,
        });
        return saved;
    }
    async setPrioritas(woId, prioritas, user) {
        if (user.role !== role_enum_1.Role.KEPALA_LAB) {
            throw new common_1.ForbiddenException('Hanya Kepala Lab yang dapat menetapkan prioritas Work Order');
        }
        const wo = await this.findOne(woId);
        const prioritasLama = wo.prioritas;
        wo.prioritas = prioritas;
        wo.diprioritaskan_oleh = user.userId;
        const saved = await this.repo.save(wo);
        await this.auditService.logChange({
            entityType: 'WorkOrder',
            entityId: woId,
            fieldName: 'prioritas',
            fieldLama: prioritasLama,
            fieldBaru: saved.prioritas,
            diubahOleh: user.userId,
        });
        return saved;
    }
    async buildDamageReport(woId, user) {
        const workOrder = await this.findOne(woId, user);
        const asset = await this.assetsService.findOne(workOrder.asset_id);
        return {
            nomor_laporan: `LK-${workOrder.created_at.getFullYear()}-${workOrder.wo_id.slice(0, 8).toUpperCase()}`,
            dibuat_pada: new Date(),
            asset: {
                asset_id: asset.asset_id,
                nama_aset: asset.nama_aset,
                no_inventaris: asset.no_inventaris,
                kategori: asset.kategori,
                merek: asset.merek,
                model: asset.model,
                serial_number: asset.serial_number,
                lokasi: [asset.gedung, asset.lantai, asset.ruangan, asset.rak]
                    .filter(Boolean)
                    .join(' / '),
            },
            work_order: workOrder,
        };
    }
    async markReportToWadek(woId, dikirim, user) {
        if (user.role !== role_enum_1.Role.KEPALA_LAB) {
            throw new common_1.ForbiddenException('Hanya Kepala Lab yang dapat menandai pengiriman laporan ke Wakil Dekan');
        }
        const wo = await this.findOne(woId);
        const statusLama = wo.laporan_ke_wadek;
        wo.laporan_ke_wadek = dikirim;
        wo.waktu_laporan_ke_wadek = dikirim ? new Date() : null;
        wo.dilaporkan_ke_wadek_oleh = dikirim ? user.userId : null;
        const saved = await this.repo.save(wo);
        await this.auditService.logChange({
            entityType: 'WorkOrder',
            entityId: woId,
            fieldName: 'laporan_ke_wadek',
            fieldLama: statusLama,
            fieldBaru: dikirim,
            diubahOleh: user.userId,
            alasan: dikirim
                ? 'Laporan kerusakan ditandai telah dikirim manual ke Wakil Dekan'
                : 'Penandaan pengiriman laporan dibatalkan',
        });
        return saved;
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(work_order_entity_1.WorkOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService,
        assets_service_1.AssetsService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map