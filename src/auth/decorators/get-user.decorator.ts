import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | null, ctx: ExecutionContext) => {
    const requst = ctx.switchToHttp().getRequest();
    if (data) return requst.user[data];
    return requst.user;
  },
);
