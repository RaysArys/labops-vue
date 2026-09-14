"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSystemRole = extractSystemRole;
const role_enum_1 = require("../common/enums/role.enum");
const SYSTEM_ROLES = new Set(Object.values(role_enum_1.Role));
function extractSystemRole(payload, clientId) {
    const roles = new Set(payload.realm_access?.roles ?? []);
    for (const role of payload.resource_access?.[clientId]?.roles ?? []) {
        roles.add(role);
    }
    return Array.from(roles).find((role) => SYSTEM_ROLES.has(role));
}
//# sourceMappingURL=keycloak-claims.js.map