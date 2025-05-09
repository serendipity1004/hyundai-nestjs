import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

export class BasicTokenGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if(!authHeader){
            throw new UnauthorizedException('Authorization 헤더가 없습니다!')
        }

        const [scheme, encoded] = authHeader.split(' ');

        if(scheme !== 'Basic' || !encoded){
            throw new UnauthorizedException('Basic 토큰이 존재하지 않습니다!')
        }

        const credentials = this.decodeBase64(encoded);
        const [username, password] = credentials.split(':')

        if(!username || !password){
            throw new UnauthorizedException('User 정보가 잘못됐습니다!');
        }

        request.credentials = {
            email: username,
            password,
        }

        return true;
    }

    decodeBase64(encoded: string){
        try{
            const buffer = Buffer.from(encoded, 'base64');
            return buffer.toString('utf-8');
        }catch(e){
            throw new UnauthorizedException('Base64 인코딩 실패');
        }
    }
}