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
exports.CalibrationController = void 0;
const common_1 = require("@nestjs/common");
const calibration_service_1 = require("./calibration.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const catat_hasil_dto_1 = require("./dto/catat-hasil.dto");
const tinjau_hasil_dto_1 = require("./dto/tinjau-hasil.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_parameter_dto_1 = require("./dto/create-parameter.dto");
const update_parameter_dto_1 = require("./dto/update-parameter.dto");
const asset_status_enum_1 = require("../assets/enums/asset-status.enum");
let CalibrationController = class CalibrationController {
    calibrationService;
    constructor(calibrationService) {
        this.calibrationService = calibrationService;
    }
    findParameters(kategori, includeInactive) {
        return this.calibrationService.findParameters(kategori, includeInactive === 'true');
    }
    createParameter(dto, user) {
        return this.calibrationService.createParameter(dto, user);
    }
    updateParameter(id, dto, user) {
        return this.calibrationService.updateParameter(id, dto, user);
    }
    findAllSchedules() {
        return this.calibrationService.findAllSchedules();
    }
    findSchedule(id) {
        return this.calibrationService.findSchedule(id);
    }
    createSchedule(dto, user) {
        return this.calibrationService.createSchedule(dto, user);
    }
    refreshStatusJadwal(id) {
        return this.calibrationService.refreshStatusJadwal(id);
    }
    selesaikanPerbaikan(id, user) {
        return this.calibrationService.selesaikanPerbaikanKembaliKeJadwal(id, user);
    }
    findLog(id) {
        return this.calibrationService.findLog(id);
    }
    findLogsBySchedule(scheduleId) {
        return this.calibrationService.findLogsBySchedule(scheduleId);
    }
    catatHasil(scheduleId, dto, user) {
        return this.calibrationService.catatHasil(scheduleId, dto, user);
    }
    tinjauHasil(id, dto, user) {
        return this.calibrationService.tinjauHasil(id, dto, user);
    }
};
exports.CalibrationController = CalibrationController;
__decorate([
    (0, common_1.Get)('parameters'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN, role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Query)('kategori')),
    __param(1, (0, common_1.Query)('include_inactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "findParameters", null);
__decorate([
    (0, common_1.Post)('parameters'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_parameter_dto_1.CreateCalibrationParameterDto, Object]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "createParameter", null);
__decorate([
    (0, common_1.Patch)('parameters/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_parameter_dto_1.UpdateCalibrationParameterDto, Object]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "updateParameter", null);
__decorate([
    (0, common_1.Get)('schedules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "findAllSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "findSchedule", null);
__decorate([
    (0, common_1.Post)('schedules'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN, role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Patch)('schedules/:id/refresh-status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "refreshStatusJadwal", null);
__decorate([
    (0, common_1.Patch)('schedules/:id/selesaikan-perbaikan'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEKNISI, role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "selesaikanPerbaikan", null);
__decorate([
    (0, common_1.Get)('logs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "findLog", null);
__decorate([
    (0, common_1.Get)('schedules/:scheduleId/logs'),
    __param(0, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "findLogsBySchedule", null);
__decorate([
    (0, common_1.Post)('schedules/:scheduleId/catat-hasil'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.LABORAN),
    __param(0, (0, common_1.Param)('scheduleId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, catat_hasil_dto_1.CatatHasilDto, Object]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "catatHasil", null);
__decorate([
    (0, common_1.Patch)('logs/:id/tinjau'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.KEPALA_LAB),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tinjau_hasil_dto_1.TinjauHasilDto, Object]),
    __metadata("design:returntype", void 0)
], CalibrationController.prototype, "tinjauHasil", null);
exports.CalibrationController = CalibrationController = __decorate([
    (0, common_1.Controller)('calibration'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [calibration_service_1.CalibrationService])
], CalibrationController);
//# sourceMappingURL=calibration.controller.js.map