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
exports.StockOpnameService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_opname_period_entity_1 = require("./stock-opname-period.entity");
const stock_opname_record_entity_1 = require("./stock-opname-record.entity");
const stock_opname_enum_1 = require("./enums/stock-opname.enum");
const assets_service_1 = require("../assets/assets.service");
const asset_entity_1 = require("../assets/asset.entity");
const maintenance_service_1 = require("../maintenance/maintenance.service");
const work_order_status_enum_1 = require("../maintenance/enums/work-order-status.enum");
const audit_service_1 = require("../audit/audit.service");
const role_enum_1 = require("../common/enums/role.enum");
let StockOpnameService = class StockOpnameService {
    periodeRepo;
    recordRepo;
    assetRepo;
    assetsService;
    maintenanceService;
    auditService;
    constructor(periodeRepo, recordRepo, assetRepo, assetsService, maintenanceService, auditService) {
        this.periodeRepo = periodeRepo;
        this.recordRepo = recordRepo;
        this.assetRepo = assetRepo;
        this.assetsService = assetsService;
        this.maintenanceService = maintenanceService;
        this.auditService = auditService;
    }
    async openPeriode(dto, user) {
        const periode = this.periodeRepo.create({
            tanggal_mulai: dto.tanggal_mulai,
            cakupan_lokasi: dto.cakupan_lokasi,
            status: stock_opname_enum_1.PeriodeStatus.AKTIF,
            dibuat_oleh: user.userId,
        });
        return this.periodeRepo.save(periode);
    }
    async findPeriode(periodeId) {
        const periode = await this.periodeRepo.findOne({
            where: { periode_id: periodeId },
        });
        if (!periode) {
            throw new common_1.NotFoundException(`Periode ${periodeId} tidak ditemukan`);
        }
        return periode;
    }
    async findAllPeriode() {
        return this.periodeRepo.find({ order: { created_at: 'DESC' } });
    }
    async closePeriode(periodeId, user) {
        const periode = await this.findPeriode(periodeId);
        if (periode.status === stock_opname_enum_1.PeriodeStatus.SELESAI) {
            throw new common_1.BadRequestException('Periode ini sudah ditutup');
        }
        periode.status = stock_opname_enum_1.PeriodeStatus.SELESAI;
        periode.tanggal_selesai = new Date().toISOString().slice(0, 10);
        const saved = await this.periodeRepo.save(periode);
        await this.auditService.logChange({
            entityType: 'StockOpnamePeriod',
            entityId: periodeId,
            fieldName: 'status',
            fieldLama: stock_opname_enum_1.PeriodeStatus.AKTIF,
            fieldBaru: stock_opname_enum_1.PeriodeStatus.SELESAI,
            diubahOleh: user.userId,
        });
        return saved;
    }
    async assertPeriodeAktif(periodeId) {
        const periode = await this.findPeriode(periodeId);
        if (periode.status !== stock_opname_enum_1.PeriodeStatus.AKTIF) {
            throw new common_1.ForbiddenException('Periode sudah ditutup — data transaksi tidak dapat diubah (FR-09)');
        }
        return periode;
    }
    async searchAsset(query) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);
        const where = [
            { nama_aset: (0, typeorm_2.ILike)(`%${query}%`) },
            { no_inventaris: (0, typeorm_2.ILike)(`%${query}%`) },
            { serial_number: (0, typeorm_2.ILike)(`%${query}%`) },
        ];
        if (isUuid) {
            where.push({ asset_id: query });
        }
        return this.assetRepo.find({ where, take: 20 });
    }
    async inputHasilPemeriksaan(periodeId, dto, user) {
        await this.assertPeriodeAktif(periodeId);
        const asset = await this.assetsService.findOne(dto.asset_id);
        const statusTemuan = this.bandingkanData(asset, dto);
        let workOrderId = null;
        if (dto.kondisi_fisik === stock_opname_enum_1.KondisiFisik.RUSAK) {
            const wo = await this.maintenanceService.createFromEscalation({
                assetId: dto.asset_id,
                deskripsi: `Ditemukan rusak saat Stock Opname periode ${periodeId}`,
                asalTemuan: work_order_status_enum_1.WorkOrderAsalTemuan.STOCK_OPNAME,
                referensiAsalId: periodeId,
                dilaporkanOleh: user.userId,
            });
            workOrderId = wo.wo_id;
        }
        const record = this.recordRepo.create({
            periode_id: periodeId,
            asset_id: dto.asset_id,
            kondisi_fisik: dto.kondisi_fisik,
            lokasi_aktual: dto.lokasi_aktual,
            qty_fisik: dto.qty_fisik,
            status_temuan: statusTemuan,
            status_tindak_lanjut: statusTemuan === stock_opname_enum_1.StatusTemuan.SESUAI ? null : stock_opname_enum_1.StatusTindakLanjut.OPEN,
            work_order_id: workOrderId,
            dicatat_oleh: user.userId,
        });
        const saved = await this.recordRepo.save(record);
        await this.auditService.logChange({
            entityType: 'StockOpnameRecord',
            entityId: saved.record_id,
            fieldName: 'status_temuan',
            fieldLama: null,
            fieldBaru: statusTemuan,
            diubahOleh: user.userId,
        });
        return saved;
    }
    bandingkanData(asset, dto) {
        if (dto.qty_fisik <= 0)
            return stock_opname_enum_1.StatusTemuan.TIDAK_DITEMUKAN;
        if (dto.qty_fisik > asset.qty_sistem)
            return stock_opname_enum_1.StatusTemuan.KELEBIHAN_FISIK;
        const kondisiSesuai = dto.kondisi_fisik === asset.kondisi;
        const qtySesuai = dto.qty_fisik === asset.qty_sistem;
        if (kondisiSesuai && qtySesuai)
            return stock_opname_enum_1.StatusTemuan.SESUAI;
        return stock_opname_enum_1.StatusTemuan.TIDAK_SESUAI;
    }
    async daftarkanAsetBaru(periodeId, dto, user) {
        await this.assertPeriodeAktif(periodeId);
        const asset = await this.assetsService.create({
            nama_aset: dto.nama_aset,
            kategori: dto.kategori,
            qty_sistem: dto.qty_fisik,
        }, user);
        const record = this.recordRepo.create({
            periode_id: periodeId,
            asset_id: asset.asset_id,
            kondisi_fisik: dto.kondisi_fisik,
            lokasi_aktual: dto.lokasi_aktual,
            qty_fisik: dto.qty_fisik,
            status_temuan: stock_opname_enum_1.StatusTemuan.SESUAI,
            status_tindak_lanjut: null,
            dicatat_oleh: user.userId,
        });
        const savedRecord = await this.recordRepo.save(record);
        return { asset, record: savedRecord };
    }
    async findRecordsByPeriode(periodeId) {
        return this.recordRepo.find({
            where: { periode_id: periodeId },
            order: { created_at: 'DESC' },
        });
    }
    async tindakLanjut(recordId, dto, user) {
        if (user.role !== role_enum_1.Role.KEPALA_LAB) {
            throw new common_1.ForbiddenException('Hanya Kepala Lab yang dapat meninjau/menyetujui tindak lanjut temuan');
        }
        const record = await this.recordRepo.findOne({
            where: { record_id: recordId },
        });
        if (!record) {
            throw new common_1.NotFoundException(`Record ${recordId} tidak ditemukan`);
        }
        if (record.status_temuan === stock_opname_enum_1.StatusTemuan.SESUAI) {
            throw new common_1.BadRequestException('Temuan berstatus Sesuai tidak memerlukan tindak lanjut');
        }
        const statusLama = record.status_tindak_lanjut;
        record.pic_tindak_lanjut = dto.pic_tindak_lanjut ?? record.pic_tindak_lanjut;
        record.target_selesai = dto.target_selesai ?? record.target_selesai;
        record.status_tindak_lanjut = dto.status_tindak_lanjut;
        const saved = await this.recordRepo.save(record);
        await this.auditService.logChange({
            entityType: 'StockOpnameRecord',
            entityId: recordId,
            fieldName: 'status_tindak_lanjut',
            fieldLama: statusLama,
            fieldBaru: saved.status_tindak_lanjut,
            diubahOleh: user.userId,
        });
        return saved;
    }
};
exports.StockOpnameService = StockOpnameService;
exports.StockOpnameService = StockOpnameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_opname_period_entity_1.StockOpnamePeriod)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_opname_record_entity_1.StockOpnameRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        assets_service_1.AssetsService,
        maintenance_service_1.MaintenanceService,
        audit_service_1.AuditService])
], StockOpnameService);
//# sourceMappingURL=stock-opname.service.js.map