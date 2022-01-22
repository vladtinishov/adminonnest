import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/admins/admins.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(login: string, pswd: string): Promise<any> {
    const admin = await this.adminsService.getAdminByLogin(login);
    if (admin && admin.pswd === pswd) {
      const { pswd, password, ...result } = admin;
      return result;
    }
    return null;
  }

  getCookieWithJwtAccessToken(adminId: number, login: string) {
    const payload = { id: adminId, login };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpirationTime,
    });
    return `Authentication=${token}`;
  }

  getCookieWithJwtRefreshToken(adminId: number, login: string) {
    const payload = { id: adminId, login };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.refreshTokenExpirationTime,
    });
    const cookie = `Refresh=${token}`;
    return {
      cookie,
      token,
    };
  }
}
