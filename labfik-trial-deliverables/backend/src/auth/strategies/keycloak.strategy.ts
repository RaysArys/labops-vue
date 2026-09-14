import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { RequestUser } from '../../common/decorators/current-user.decorator';
import {
  extractSystemRole,
  KeycloakTokenPayload,
} from '../keycloak-claims';

// Dipakai saat AUTH_STRATEGY=keycloak.
// Validasi token dilakukan terhadap public key Keycloak (JWKS endpoint),
// BUKAN secret lokal — sistem ini tidak lagi menerbitkan token sendiri,
// cuma mempercayai token yang sudah ditandatangani Keycloak.
//
// NOTE: strategy ini baru dipasang aktif kalau AUTH_STRATEGY=keycloak.
// Sebelum realm/client dari pihak IT UPN tersedia, jangan diaktifkan dulu —
// isi KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID di .env sesuai info dari IT.
//
// Install dependency saat mode ini mulai dipakai:
//   npm install jwks-rsa
@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const keycloakUrl = config.getOrThrow<string>('KEYCLOAK_URL').replace(/\/$/, '');
    const realm = config.getOrThrow<string>('KEYCLOAK_REALM');
    const clientId = config.getOrThrow<string>('KEYCLOAK_CLIENT_ID');
    const issuerUrl = (
      config.get<string>('KEYCLOAK_ISSUER_URL') ?? keycloakUrl
    ).replace(/\/$/, '');
    const jwksUri =
      config.get<string>('KEYCLOAK_JWKS_URL') ??
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`;
    const validateAudience =
      config.get<string>('KEYCLOAK_VALIDATE_AUDIENCE', 'true') !== 'false';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      issuer: `${issuerUrl}/realms/${realm}`,
      ...(validateAudience ? { audience: clientId } : {}),
      algorithms: ['RS256'],
    });

    this.clientId = clientId;
  }

  private readonly clientId: string;

  // Struktur claim role di Keycloak biasanya ada di realm_access.roles
  // atau resource_access.<client_id>.roles, tergantung konfigurasi realm.
  // Sesuaikan pemetaan ini begitu tim IT UPN mengkonfirmasi struktur token.
  async validate(payload: KeycloakTokenPayload): Promise<RequestUser> {
    const mappedRole = extractSystemRole(payload, this.clientId);
    if (!mappedRole) {
      throw new UnauthorizedException(
        'Akun Keycloak belum memiliki role LabFIK yang valid',
      );
    }

    return {
      userId: payload.sub,
      email: payload.email ?? payload.preferred_username ?? payload.sub,
      role: mappedRole,
      nama: payload.name,
    };
  }
}
