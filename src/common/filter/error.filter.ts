import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Catch(HttpException)
export class ErrorExceptionFilter implements ExceptionFilter{
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ){}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const message = exception.getResponse();

        this.logger.error('에러 발생!');

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}