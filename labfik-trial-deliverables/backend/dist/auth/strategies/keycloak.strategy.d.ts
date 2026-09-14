import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RequestUser } from '../../common/decorators/current-user.decorator';
import { KeycloakTokenPayload } from '../keycloak-claims';
declare const KeycloakStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class KeycloakStrategy extends KeycloakStrategy_base {
    constructor(config: ConfigService);
    private readonly clientId;
    validate(payload: KeycloakTokenPayload): Promise<RequestUser>;
}
export {};
