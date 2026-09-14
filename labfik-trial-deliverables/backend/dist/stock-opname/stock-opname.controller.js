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
exports.StockOpnameController = void 0;
const common_1 = require("@nestjs/common");
const stock_opname_service_1 = require("./stock-opname.service");
const open_periode_dto_1 = require("./dto/open-periode.dto");
const input_hasil_pemeriksaan_dto_1 = require("./dto/input-hasil-pemeriksaan.dto");
const daftarkan_aset_baru_dto_1 = require("./dto/daftarkan-aset-baru.dto");
const tindak_lanjut_dto_1 = require("./dto/tindak-lanjut.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let StockOpnameController = class StockOpnameController {
    stockOpnameService;
    constructor(stockOpnameService) {
        this.stockOpnameService = stockOpnameService;
    }
    findAllPeriode() {
        return this.stockOpnameService.findAllPeriode();
    }
    findPeriode(id) {
        return this.stockOpnameService.findPeriode(id);
    }
    openPeriode(dto, user) {
        return this.stockOpnameService.openPeriode(dto, user);
    }
    closePeriode(id, user) {
        return this.stockOpnameService.closePeriode(id, user);
    }
    searchAsset(query) {
        return this.stockOpnameService.searchAsset(query ?? '');
    }
    inputHasilPemeriksaan(periodeId, dto, user) {
        return this.stockOpnameService.inputHasilPemeriksaan(periodeId, dto, user);
    }
    daftarkanAsetBaru(periodeId, dto, user) {
        return this.stockOpnameService.daftarkanAsetBaru(periodeId, dto, user);
    }
    findRecordsByPeriode(periodeId) {
        return this.stockOpnameService.findRecordsByPeriode(periodeId);
    }
    tindakLanjut(recordId, dto, user) {
        return this.stockOpnameService.tindakLanjut(recordId, dto, user);
    }
};
exports.StockOpnameController = StockOpnameController;
__decorate([
    (0, common_1.Get)('periode'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "findAllPeriode", null);
__decorate([
    (0, common_1.Get)('periode/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "findPeriode", null);
__decorate([
    (0, common_1.Post)('periode'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN, role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [open_periode_dto_1.OpenPeriodeDto, Object]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "openPeriode", null);
__decorate([
    (0, common_1.Patch)('periode/:id/tutup'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN, role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "closePeriode", null);
__decorate([
    (0, common_1.Get)('search-asset'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "searchAsset", null);
__decorate([
    (0, common_1.Post)('periode/:periodeId/pemeriksaan'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN),
    __param(0, (0, common_1.Param)('periodeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, input_hasil_pemeriksaan_dto_1.InputHasilPemeriksaanDto, Object]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "inputHasilPemeriksaan", null);
__decorate([
    (0, common_1.Post)('periode/:periodeId/aset-baru'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN),
    __param(0, (0, common_1.Param)('periodeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, daftarkan_aset_baru_dto_1.DaftarkanAsetBaruDto, Object]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "daftarkanAsetBaru", null);
__decorate([
    (0, common_1.Get)('periode/:periodeId/records'),
    __param(0, (0, common_1.Param)('periodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "findRecordsByPeriode", null);
__decorate([
    (0, common_1.Patch)('records/:recordId/tindak-lanjut'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('recordId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tindak_lanjut_dto_1.TindakLanjutDto, Object]),
    __metadata("design:returntype", void 0)
], StockOpnameController.prototype, "tindakLanjut", null);
exports.StockOpnameController = StockOpnameController = __decorate([
    (0, common_1.Controller)('stock-opname'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [stock_opname_service_1.StockOpnameService])
], StockOpnameController);
//# sourceMappingURL=stock-opname.controller.js.map