import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { AuditService } from '../audit/audit.service';
export declare class UsersService {
    private readonly repo;
    private readonly auditService;
    constructor(repo: Repository<User>, auditService: AuditService);
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    create(data: {
        nama: string;
        email: string;
        passwordHash: string | null;
        role: Role;
    }): Promise<User>;
    createByTataUsaha(dto: CreateUserDto, dibuatOleh: RequestUser): Promise<Pick<User, 'user_id' | 'nama' | 'email' | 'role' | 'created_at'>>;
}
