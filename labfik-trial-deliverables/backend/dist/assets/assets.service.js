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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("./asset.entity");
const asset_status_enum_1 = require("./enums/asset-status.enum");
const asset_approval_state_machine_1 = require("./asset-approval.state-machine");
const audit_service_1 = require("../audit/audit.service");
const role_enum_1 = require("../common/enums/role.enum");
let AssetsService = class AssetsService {
    repo;
    auditService;
    constructor(repo, auditService) {
        this.repo = repo;
        this.auditService = auditService;
    }
    async findAll() {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }
    async findOne(assetId) {
        const asset = await this.repo.findOne({ where: { asset_id: assetId } });
        if (!asset)
            throw new common_1.NotFoundException(`Aset ${assetId} tidak ditemukan`);
        return asset;
    }
    async create(dto, user) {
        const asset = this.repo.create({
            ...dto,
            status_approval: asset_status_enum_1.ApprovalStatus.DRAFT,
            diajukan_oleh: user.userId,
        });
        return this.repo.save(asset);
    }
    async update(assetId, dto, user) {
        const asset = await this.findOne(assetId);
        const before = { ...asset };
        Object.assign(asset, dto);
        if (asset.status_approval === asset_status_enum_1.ApprovalStatus.APPROVED) {
            asset.status_approval = asset_status_enum_1.ApprovalStatus.DRAFT;
            asset.diajukan_oleh = user.userId;
            asset.disetujui_oleh = null;
            asset.waktu_approval = null;
        }
        const saved = await this.repo.save(asset);
        await this.auditService.logDiff('Asset', assetId, before, saved, user.userId);
        return saved;
    }
    async transitionApproval(assetId, action, user, alasan) {
        if ((action === 'setujui' || action === 'tolak') &&
            user.role !== role_enum_1.Role.WAKIL_DEKAN) {
            throw new common_1.ForbiddenException('Hanya Wakil Dekan yang dapat menyetujui/menolak perubahan aset');
        }
        const asset = await this.findOne(assetId);
        const statusLama = asset.status_approval;
        asset.status_approval = (0, asset_approval_state_machine_1.transitionAssetApproval)(statusLama, action);
        if (action === 'ajukan') {
            asset.diajukan_oleh = user.userId;
        }
        if (action === 'setujui' || action === 'tolak') {
            asset.disetujui_oleh = user.userId;
            asset.waktu_approval = new Date();
        }
        const saved = await this.repo.save(asset);
        await this.auditService.logChange({
            entityType: 'Asset',
            entityId: assetId,
            fieldName: 'status_approval',
            fieldLama: statusLama,
            fieldBaru: asset.status_approval,
            diubahOleh: user.userId,
            alasan,
        });
        return saved;
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map