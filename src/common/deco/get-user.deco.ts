import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): { uuid: string, role: string, isAdmin: boolean } => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
