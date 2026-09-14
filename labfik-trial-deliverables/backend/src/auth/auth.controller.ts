import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // Endpoint ini hanya relevan untuk AUTH_STRATEGY=local.
  // Untuk mode keycloak, frontend akan redirect ke Keycloak login page,
  // bukan memanggil endpoint ini.
  @Post('login')
  async login(@Body() dto: LoginDto) {
    if (this.config.get<string>('AUTH_STRATEGY', 'local') !== 'local') {
      throw new NotFoundException(
        'Login lokal dinonaktifkan. Gunakan halaman login Keycloak.',
      );
    }
    return this.authService.login(dto.email, dto.password);
  }
}
