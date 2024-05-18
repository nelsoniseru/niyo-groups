import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Strategy } from "passport-jwt";
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(request, response, next) {
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException();
        }
        const token = authorization.split(' ')[1];
        const claims = await this.jwtService.verifyAsync(token)
            .catch(() => { throw new UnauthorizedException(); });

    

        request.user = claims.id;

        next();
    }
}