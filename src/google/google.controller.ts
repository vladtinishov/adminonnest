import { Controller, Get, Query, Req } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CredentialsData, GoogleAppsService } from './google_apps/google_apps.service';
import { GoogleAppId, GoogleOAuthService } from './google_oauth/google_oauth.service';

@Controller('google')
export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private googleAppsService: GoogleAppsService,
    private googleOAuthService: GoogleOAuthService,
  ) {}

  // @Get()
  // getUrl() {
  //   return this.googleService.getAuthUrl(['sheets', 'email']);
  // }

  @Get('/redirect')
  getToken(@Req() req) {
    const token = req.query.code;
    return this.googleService.getAccessToken(token);
  }

  @Get('/user')
  async getUser(@Req() req) {
    const token = req.query.token;
    return await this.googleService.getUserInfo(token);
  }

  @Get('/refresh')
  async getRefreshToken(@Req() req) {
    const refreshToken = req.query.refresh_token;
    return await this.googleService.refreshAccessToken(refreshToken);
  }

  @Get('/get-token')
  async getJwt(@Query() query: CredentialsData) {
    return this.googleAppsService.saveCredentials(query);
  }

  @Get('/get-url')
  async getUrl(@Query() query) {
    const id: GoogleAppId = query.id;
    console.log(query);
    return await this.googleOAuthService.getAuthUrl(id);
  }

}
