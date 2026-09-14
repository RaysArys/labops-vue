import type { RequestUser } from '../common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto, user: RequestUser): Promise<Pick<import("./user.entity").User, "user_id" | "nama" | "email" | "role" | "created_at">>;
}
