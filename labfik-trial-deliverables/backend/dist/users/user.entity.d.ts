import { Role } from '../common/enums/role.enum';
export declare class User {
    user_id: string;
    nama: string;
    email: string;
    password_hash: string | null;
    role: Role;
    created_at: Date;
}
