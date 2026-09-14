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
exports.MaintenanceController = void 0;
const common_1 = require("@nestjs/common");
const maintenance_service_1 = require("./maintenance.service");
const create_work_order_dto_1 = require("./dto/create-work-order.dto");
const transition_work_order_dto_1 = require("./dto/transition-work-order.dto");
const set_prioritas_dto_1 = require("./dto/set-prioritas.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const mark_wadek_report_dto_1 = require("./dto/mark-wadek-report.dto");
let MaintenanceController = class MaintenanceController {
    maintenanceService;
    constructor(maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    findAll(user) {
        return this.maintenanceService.findAll(user);
    }
    findOne(id, user) {
        return this.maintenanceService.findOne(id, user);
    }
    buildDamageReport(id, user) {
        return this.maintenanceService.buildDamageReport(id, user);
    }
    create(dto, user) {
        return this.maintenanceService.create(dto, user);
    }
    transitionStatus(id, dto, user) {
        return this.maintenanceService.transitionStatus(id, dto.action, user, {
            catatan_perbaikan: dto.catatan_perbaikan,
            biaya: dto.biaya,
            downtime_jam: dto.downtime_jam,
        });
    }
    setPrioritas(id, dto, user) {
        return this.maintenanceService.setPrioritas(id, dto.prioritas, user);
    }
    markReportToWadek(id, dto, user) {
        return this.maintenanceService.markReportToWadek(id, dto.dikirim, user);
    }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/laporan-kerusakan'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB, role_enum_1.Role.WAKIL_DEKAN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "buildDamageReport", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_work_order_dto_1.CreateWorkOrderDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEKNISI, role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transition_work_order_dto_1.TransitionWorkOrderDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "transitionStatus", null);
__decorate([
    (0, common_1.Patch)(':id/prioritas'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_prioritas_dto_1.SetPrioritasDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "setPrioritas", null);
__decorate([
    (0, common_1.Patch)(':id/laporan-wadek'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mark_wadek_report_dto_1.MarkWadekReportDto, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "markReportToWadek", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, common_1.Controller)('work-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map