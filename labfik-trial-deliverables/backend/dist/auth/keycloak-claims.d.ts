import { Role } from '../common/enums/role.enum';
export interface KeycloakTokenPayload {
    sub: string;
    email?: string;
    preferred_username?: string;
    name?: string;
    realm_access?: {
        roles?: string[];
    };
    resource_access?: Record<string, {
        roles?: string[];
    }>;
}
export declare function extractSystemRole(payload: KeycloakTokenPayload, clientId: string): Role | undefined;
