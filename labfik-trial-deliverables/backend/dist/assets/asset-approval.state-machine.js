"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionAssetApproval = transitionAssetApproval;
const common_1 = require("@nestjs/common");
const asset_status_enum_1 = require("./enums/asset-status.enum");
const TRANSITIONS = {
    [asset_status_enum_1.ApprovalStatus.DRAFT]: {
        ajukan: asset_status_enum_1.ApprovalStatus.PENDING_APPROVAL,
    },
    [asset_status_enum_1.ApprovalStatus.PENDING_APPROVAL]: {
        setujui: asset_status_enum_1.ApprovalStatus.APPROVED,
        tolak: asset_status_enum_1.ApprovalStatus.REJECTED,
    },
    [asset_status_enum_1.ApprovalStatus.REJECTED]: {
        revisi: asset_status_enum_1.ApprovalStatus.DRAFT,
    },
    [asset_status_enum_1.ApprovalStatus.APPROVED]: {},
};
function transitionAssetApproval(current, action) {
    const next = TRANSITIONS[current]?.[action];
    if (!next) {
        throw new common_1.BadRequestException(`Transisi tidak valid: aksi "${action}" tidak bisa dilakukan dari status "${current}"`);
    }
    return next;
}
//# sourceMappingURL=asset-approval.state-machine.js.map