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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_configuration_change_entity_1 = require("./item-configuration-change.entity");
let AuditService = class AuditService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async logChange(params) {
        const entry = this.repo.create({
            entity_type: params.entityType,
            entity_id: params.entityId,
            field_name: params.fieldName,
            field_lama: params.fieldLama != null ? String(params.fieldLama) : null,
            field_baru: params.fieldBaru != null ? String(params.fieldBaru) : null,
            diubah_oleh: params.diubahOleh,
            alasan: params.alasan,
        });
        await this.repo.save(entry);
    }
    async logDiff(entityType, entityId, before, after, diubahOleh, alasan) {
        const changedFields = Object.keys(after).filter((key) => before[key] !== after[key]);
        for (const field of changedFields) {
            await this.logChange({
                entityType,
                entityId,
                fieldName: field,
                fieldLama: before[field],
                fieldBaru: after[field],
                diubahOleh,
                alasan,
            });
        }
    }
    async findByEntity(entityType, entityId) {
        return this.repo.find({
            where: { entity_type: entityType, entity_id: entityId },
            order: { waktu_perubahan: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.repo.find({
            where: { diubah_oleh: userId },
            order: { waktu_perubahan: 'DESC' },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_configuration_change_entity_1.ItemConfigurationChange)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditService);
//# sourceMappingURL=audit.service.js.map