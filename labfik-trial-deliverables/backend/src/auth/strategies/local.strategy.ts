import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RequestUser } from '../../common/decorators/current-user.decorator';

// Dipakai saat AUTH_STRATEGY=local.
// Token diterbitkan sendiri oleh AuthService.login() (lihat auth.service.ts),
// ditandatangani pakai JWT_SECRET lokal.
@Injectable()
export class LocalJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev-secret-CHANGE-ME',
    });
  }

  // Payload di sini adalah isi token yang di-decode; strukturnya didefinisikan
  // saat AuthService menandatangani token (lihat auth.service.ts -> login()).
  async validate(payload: {
    sub: string;
    email: string;
    role: string;
    nama?: string;
  }): Promise<RequestUser> {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      nama: payload.nama,
    };
  }
}
