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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPrioritasDto = void 0;
const class_validator_1 = require("class-validator");
const work_order_status_enum_1 = require("../enums/work-order-status.enum");
class SetPrioritasDto {
    prioritas;
}
exports.SetPrioritasDto = SetPrioritasDto;
__decorate([
    (0, class_validator_1.IsEnum)(work_order_status_enum_1.WorkOrderPrioritas),
    __metadata("design:type", String)
], SetPrioritasDto.prototype, "prioritas", void 0);
//# sourceMappingURL=set-prioritas.dto.js.map