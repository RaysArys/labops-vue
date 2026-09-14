import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RequestUser } from '../../common/decorators/current-user.decorator';
declare const LocalJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalJwtStrategy extends LocalJwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
        nama?: string;
    }): Promise<RequestUser>;
}
export {};
