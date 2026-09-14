"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionWorkOrder = transitionWorkOrder;
const common_1 = require("@nestjs/common");
const work_order_status_enum_1 = require("./enums/work-order-status.enum");
const TRANSITIONS = {
    [work_order_status_enum_1.WorkOrderStatus.OPEN]: {
        mulai_kerjakan: work_order_status_enum_1.WorkOrderStatus.IN_PROGRESS,
        batalkan: work_order_status_enum_1.WorkOrderStatus.CANCELLED,
    },
    [work_order_status_enum_1.WorkOrderStatus.IN_PROGRESS]: {
        selesaikan: work_order_status_enum_1.WorkOrderStatus.RESOLVED,
        batalkan: work_order_status_enum_1.WorkOrderStatus.CANCELLED,
    },
    [work_order_status_enum_1.WorkOrderStatus.RESOLVED]: {
        tutup: work_order_status_enum_1.WorkOrderStatus.CLOSED,
        buka_kembali: work_order_status_enum_1.WorkOrderStatus.IN_PROGRESS,
    },
    [work_order_status_enum_1.WorkOrderStatus.CLOSED]: {},
    [work_order_status_enum_1.WorkOrderStatus.CANCELLED]: {},
};
function transitionWorkOrder(current, action) {
    const next = TRANSITIONS[current]?.[action];
    if (!next) {
        throw new common_1.BadRequestException(`Transisi tidak valid: aksi "${action}" tidak bisa dilakukan dari status "${current}"`);
    }
    return next;
}
//# sourceMappingURL=work-order.state-machine.js.map