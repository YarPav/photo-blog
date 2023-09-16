import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (_: unknown, context: ExecutionContext): number | null => {
    const request = context.switchToHttp().getRequest();
    return request.user?.id ? Number(request.user.id) : null;
  },
);
