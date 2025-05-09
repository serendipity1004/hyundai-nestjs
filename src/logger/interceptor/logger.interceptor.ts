import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ){}

    intercept(
        context: ExecutionContext, 
        next: CallHandler<any>
    ): Observable<any>{
        const req = context.switchToHttp().getRequest();
        const {method, originalUrl} = req;

        const now = Date.now();

        return next.handle().pipe(
            tap((responseData)=>{
                const res = context.switchToHttp().getResponse();
                const statusCode = res.statusCode;

                this.logger.log(
                    `[${method}] ${originalUrl} -> ${statusCode} +${Date.now() - now}ms`
                );
            })
        );
    }
}