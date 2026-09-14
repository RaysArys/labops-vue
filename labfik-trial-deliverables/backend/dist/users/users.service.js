"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./user.entity");
const role_enum_1 = require("../common/enums/role.enum");
const audit_service_1 = require("../audit/audit.service");
let UsersService = class UsersService {
    repo;
    auditService;
    constructor(repo, auditService) {
        this.repo = repo;
        this.auditService = auditService;
    }
    async findByEmail(email) {
        return this.repo
            .createQueryBuilder('user')
            .addSelect('user.password_hash')
            .where('user.email = :email', { email })
            .getOne();
    }
    async findById(userId) {
        return this.repo.findOne({ where: { user_id: userId } });
    }
    async create(data) {
        const user = this.repo.create({
            nama: data.nama,
            email: data.email,
            password_hash: data.passwordHash,
            role: data.role,
        });
        return this.repo.save(user);
    }
    async createByTataUsaha(dto, dibuatOleh) {
        if (dibuatOleh.role !== role_enum_1.Role.TATA_USAHA) {
            throw new common_1.ForbiddenException('Hanya Tata Usaha yang dapat membuat user baru');
        }
        if ((process.env.AUTH_STRATEGY ?? 'local') !== 'local') {
            throw new common_1.BadRequestException('Pembuatan user lokal tidak tersedia saat AUTH_STRATEGY=keycloak; gunakan administrasi Keycloak');
        }
        if (!Object.values(role_enum_1.Role).includes(dto.role)) {
            throw new common_1.BadRequestException('Role user tidak valid');
        }
        const email = dto.email.trim().toLowerCase();
        const existing = await this.repo.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException(`Email ${email} sudah terdaftar`);
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = this.repo.create({
            nama: dto.nama.trim(),
            email,
            password_hash: passwordHash,
            role: dto.role,
        });
        let saved;
        try {
            saved = await this.repo.save(user);
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError &&
                error
                    .driverError?.code === '23505') {
                throw new common_1.ConflictException(`Email ${email} sudah terdaftar`);
            }
            throw error;
        }
        await this.auditService.logChange({
            entityType: 'User',
            entityId: saved.user_id,
            fieldName: 'created',
            fieldLama: null,
            fieldBaru: JSON.stringify({ email: saved.email, role: saved.role }),
            diubahOleh: dibuatOleh.userId,
        });
        return {
            user_id: saved.user_id,
            nama: saved.nama,
            email: saved.email,
            role: saved.role,
            created_at: saved.created_at,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map