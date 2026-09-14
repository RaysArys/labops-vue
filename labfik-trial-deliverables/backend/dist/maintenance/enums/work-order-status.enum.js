"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderStatus = exports.WorkOrderPrioritas = exports.WorkOrderAsalTemuan = void 0;
var WorkOrderAsalTemuan;
(function (WorkOrderAsalTemuan) {
    WorkOrderAsalTemuan["MANUAL"] = "manual";
    WorkOrderAsalTemuan["STOCK_OPNAME"] = "stock_opname";
    WorkOrderAsalTemuan["KALIBRASI"] = "kalibrasi";
})(WorkOrderAsalTemuan || (exports.WorkOrderAsalTemuan = WorkOrderAsalTemuan = {}));
var WorkOrderPrioritas;
(function (WorkOrderPrioritas) {
    WorkOrderPrioritas["RENDAH"] = "rendah";
    WorkOrderPrioritas["SEDANG"] = "sedang";
    WorkOrderPrioritas["TINGGI"] = "tinggi";
    WorkOrderPrioritas["CRITICAL"] = "critical";
})(WorkOrderPrioritas || (exports.WorkOrderPrioritas = WorkOrderPrioritas = {}));
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["OPEN"] = "open";
    WorkOrderStatus["IN_PROGRESS"] = "in_progress";
    WorkOrderStatus["RESOLVED"] = "resolved";
    WorkOrderStatus["CLOSED"] = "closed";
    WorkOrderStatus["CANCELLED"] = "cancelled";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
//# sourceMappingURL=work-order-status.enum.js.map