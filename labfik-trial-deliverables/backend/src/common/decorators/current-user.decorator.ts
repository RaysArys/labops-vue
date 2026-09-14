import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Pemakaian di controller: findAll(@CurrentUser() user: RequestUser)
// Mengambil req.user yang sudah diisi oleh AuthGuard/JwtStrategy,
// jadi controller/service lain tidak perlu tahu strategy auth apa yang aktif.
export interface RequestUser {
  userId: string;
  email: string;
  role: string;
  nama?: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
