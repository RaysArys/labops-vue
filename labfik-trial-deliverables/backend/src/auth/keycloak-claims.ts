import { Role } from '../common/enums/role.enum';

export interface KeycloakTokenPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

const SYSTEM_ROLES = new Set<string>(Object.values(Role));

export function extractSystemRole(
  payload: KeycloakTokenPayload,
  clientId: string,
): Role | undefined {
  const roles = new Set<string>(payload.realm_access?.roles ?? []);

  for (const role of payload.resource_access?.[clientId]?.roles ?? []) {
    roles.add(role);
  }

  return Array.from(roles).find((role) => SYSTEM_ROLES.has(role)) as
    | Role
    | undefined;
}
