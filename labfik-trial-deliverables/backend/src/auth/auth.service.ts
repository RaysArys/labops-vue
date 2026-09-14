import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

// Service ini HANYA dipakai saat AUTH_STRATEGY=local — dia yang menerbitkan
// token JWT sendiri setelah verifikasi email/password.
// Saat AUTH_STRATEGY=keycloak, endpoint /auth/login tidak dipakai lagi;
// login dilakukan di sisi Keycloak (redirect flow), dan NestJS cuma
// jadi resource server yang memvalidasi token yang sudah ada.
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Struktur payload ini yang di-decode balik oleh LocalJwtStrategy.validate()
    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
      nama: user.nama,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        nama: user.nama,
      },
    };
  }
}
