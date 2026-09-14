"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalibrationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const calibration_schedule_entity_1 = require("./calibration-schedule.entity");
const calibration_log_entity_1 = require("./calibration-log.entity");
const calibration_service_1 = require("./calibration.service");
const calibration_controller_1 = require("./calibration.controller");
const maintenance_module_1 = require("../maintenance/maintenance.module");
const audit_module_1 = require("../audit/audit.module");
const calibration_parameter_entity_1 = require("./calibration-parameter.entity");
const assets_module_1 = require("../assets/assets.module");
let CalibrationModule = class CalibrationModule {
};
exports.CalibrationModule = CalibrationModule;
exports.CalibrationModule = CalibrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                calibration_schedule_entity_1.CalibrationSchedule,
                calibration_log_entity_1.CalibrationLog,
                calibration_parameter_entity_1.CalibrationParameter,
            ]),
            maintenance_module_1.MaintenanceModule,
            audit_module_1.AuditModule,
            assets_module_1.AssetsModule,
        ],
        controllers: [calibration_controller_1.CalibrationController],
        providers: [calibration_service_1.CalibrationService],
    })
], CalibrationModule);
//# sourceMappingURL=calibration.module.js.map