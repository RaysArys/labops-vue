export interface RequestUser {
    userId: string;
    email: string;
    role: string;
    nama?: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
