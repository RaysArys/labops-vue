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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("./vendor.entity");
const status_akreditasi_enum_1 = require("./enums/status-akreditasi.enum");
const audit_service_1 = require("../audit/audit.service");
const role_enum_1 = require("../common/enums/role.enum");
let VendorsService = class VendorsService {
    repo;
    auditService;
    constructor(repo, auditService) {
        this.repo = repo;
        this.auditService = auditService;
    }
    async findAll() {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }
    async findOne(vendorId) {
        const vendor = await this.repo.findOne({ where: { vendor_id: vendorId } });
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor ${vendorId} tidak ditemukan`);
        return vendor;
    }
    assertTataUsaha(user) {
        if (user.role !== role_enum_1.Role.TATA_USAHA) {
            throw new common_1.ForbiddenException('Hanya Tata Usaha yang dapat mengelola data vendor');
        }
    }
    async create(dto, user) {
        this.assertTataUsaha(user);
        const vendor = this.repo.create({
            ...dto,
            dikelola_oleh: user.userId,
            status_akreditasi: status_akreditasi_enum_1.StatusAkreditasi.AKTIF,
        });
        return this.repo.save(vendor);
    }
    async update(vendorId, dto, user) {
        this.assertTataUsaha(user);
        const vendor = await this.findOne(vendorId);
        const before = { ...vendor };
        Object.assign(vendor, dto);
        const saved = await this.repo.save(vendor);
        await this.auditService.logDiff('Vendor', vendorId, before, saved, user.userId);
        return saved;
    }
    async refreshStatusAkreditasi(vendorId, hariAmbangBatas = 30) {
        const vendor = await this.findOne(vendorId);
        if (!vendor.tanggal_expired_akreditasi)
            return vendor;
        const now = new Date();
        const expired = new Date(vendor.tanggal_expired_akreditasi);
        const selisihHari = Math.floor((expired.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const statusLama = vendor.status_akreditasi;
        let statusBaru = statusLama;
        if (selisihHari < 0) {
            statusBaru = status_akreditasi_enum_1.StatusAkreditasi.EXPIRED;
        }
        else if (selisihHari <= hariAmbangBatas) {
            statusBaru = status_akreditasi_enum_1.StatusAkreditasi.AKAN_EXPIRED;
        }
        else {
            statusBaru = status_akreditasi_enum_1.StatusAkreditasi.AKTIF;
        }
        if (statusBaru !== statusLama) {
            vendor.status_akreditasi = statusBaru;
            await this.repo.save(vendor);
            await this.auditService.logChange({
                entityType: 'Vendor',
                entityId: vendorId,
                fieldName: 'status_akreditasi',
                fieldLama: statusLama,
                fieldBaru: statusBaru,
                diubahOleh: 'system',
            });
        }
        return vendor;
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map