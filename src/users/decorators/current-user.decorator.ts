import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//context-> wrapper around incoming http request
//ExecutionContext-> it can be used to abstract a websocket,grpc,http,incoming message,graphql
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
