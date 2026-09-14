"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const jwks_rsa_1 = require("jwks-rsa");
const keycloak_claims_1 = require("../keycloak-claims");
let KeycloakStrategy = class KeycloakStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(config) {
        const keycloakUrl = config.getOrThrow('KEYCLOAK_URL').replace(/\/$/, '');
        const realm = config.getOrThrow('KEYCLOAK_REALM');
        const clientId = config.getOrThrow('KEYCLOAK_CLIENT_ID');
        const issuerUrl = (config.get('KEYCLOAK_ISSUER_URL') ?? keycloakUrl).replace(/\/$/, '');
        const jwksUri = config.get('KEYCLOAK_JWKS_URL') ??
            `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`;
        const validateAudience = config.get('KEYCLOAK_VALIDATE_AUDIENCE', 'true') !== 'false';
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: (0, jwks_rsa_1.passportJwtSecret)({
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
    clientId;
    async validate(payload) {
        const mappedRole = (0, keycloak_claims_1.extractSystemRole)(payload, this.clientId);
        if (!mappedRole) {
            throw new common_1.UnauthorizedException('Akun Keycloak belum memiliki role LabFIK yang valid');
        }
        return {
            userId: payload.sub,
            email: payload.email ?? payload.preferred_username ?? payload.sub,
            role: mappedRole,
            nama: payload.name,
        };
    }
};
exports.KeycloakStrategy = KeycloakStrategy;
exports.KeycloakStrategy = KeycloakStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KeycloakStrategy);
//# sourceMappingURL=keycloak.strategy.js.map