import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

// Pemakaian: @Roles(Role.KEPALA_LAB, Role.WAKIL_DEKAN)
// Ditaruh di atas method controller untuk membatasi siapa saja yang boleh akses.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
