import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard ini generik terhadap strategy yang aktif — baik LocalJwtStrategy
// maupun KeycloakStrategy sama-sama didaftarkan dengan nama 'jwt' di
// PassportStrategy, jadi controller cukup pakai satu guard ini terus,
// tidak perlu tahu mode auth mana yang sedang jalan.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
