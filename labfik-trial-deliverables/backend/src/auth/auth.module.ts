import 'dotenv/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalJwtStrategy } from './strategies/local.strategy';
import { KeycloakStrategy } from './strategies/keycloak.strategy';

// Titik satu-satunya di seluruh project yang tahu soal AUTH_STRATEGY.
// Module lain (assets, calibration, dst) cukup pakai JwtAuthGuard +
// @CurrentUser() tanpa peduli strategy mana yang aktif — lihat
// jwt-auth.guard.ts untuk penjelasan kenapa ini transparan buat mereka.
//
// PENTING: hanya SATU strategy boleh benar-benar terdaftar ke Passport
// dengan nama 'jwt' pada satu waktu jalan (kalau dua class strategy
// sama-sama di-provide, yang terakhir load akan menimpa yang pertama
// secara diam-diam). Makanya pemilihannya dilakukan di sini lewat
// process.env langsung saat module di-assemble (bukan run-time per
// request), sesuai AUTH_STRATEGY yang di-set di .env.
const authStrategy = process.env.AUTH_STRATEGY ?? 'local';

const ActiveStrategyProvider =
  authStrategy === 'keycloak' ? KeycloakStrategy : LocalJwtStrategy;

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret-CHANGE-ME',
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ActiveStrategyProvider],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    // eslint-disable-next-line no-console
    console.log(`[AuthModule] AUTH_STRATEGY aktif: ${authStrategy}`);
  }
}
