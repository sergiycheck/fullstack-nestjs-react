import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsersForGroupCreation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { usersForGroupCreation } = req;
    if (usersForGroupCreation) return usersForGroupCreation;
  },
);
