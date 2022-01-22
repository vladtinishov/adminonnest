import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './gurads/jwt-refresh.guard';
import { LocalAuthGuard } from './gurads/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: AdminsService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Request() req) {
    const { user } = req;
    const atCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
      user.login,
    );
    return atCookie;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { user } = req;
    const atCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
      user.login,
    );
    const rt = this.authService.getCookieWithJwtRefreshToken(
      user.id,
      user.login,
    );
    await this.usersService.setRefreshToken(rt.token, user.id);

    return {
      access_token: atCookie,
      refresh_token: rt.cookie,
    };
  }
}
