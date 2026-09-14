import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            userId: string;
            email: string;
            role: import("../common/enums/role.enum").Role;
            nama: string;
        };
    }>;
}
