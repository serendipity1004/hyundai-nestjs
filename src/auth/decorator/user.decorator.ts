import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const User = createParamDecorator(
    (_, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    }
)