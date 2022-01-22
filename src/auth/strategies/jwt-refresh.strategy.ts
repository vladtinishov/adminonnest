import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { AdminsService } from 'src/admins/admins.service';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly adminService: AdminsService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.body?.refresh_token;
        },
      ]),
      secretOrKey: jwtConstants.refreshTokenSecret,
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload) {
    return this.adminService.getAdminIfRefreshTokenMatches(
      request?.body?.refresh_token,
      payload.id,
    );
  }
}
