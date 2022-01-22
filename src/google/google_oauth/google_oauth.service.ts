import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { google } from 'googleapis';
import { Repository } from 'typeorm';
import { scopesData } from '../constants/scopes';
import { GoogleApps } from '../entities/google_apps.entity';

export type OauthData = {
  name: string;
  scopes: string;
  client_secret: string;
  client_id: string;
  api_key?: string;
}

export type Ids = {
  google_app_id: number;
  amo_account_id: number;
}

@Injectable()
export class GoogleOAuthService {
  constructor(
    @InjectRepository(GoogleApps)
    private readonly usersRepository: Repository<GoogleApps>,
  ) {
    this.usersRepository.findOne()
  }

  async getOAuthClient(googleAppsId: number) {
    const credentials = await this.usersRepository.findOne(googleAppsId);
    const { client_id, client_secret, redirect_uri } = credentials;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  }

  // saveOauth(oauthData: OauthData) {
  //   credentialsData.api_key = hashSync(JSON.stringify(credentialsData), 9);
  //   return this.usersRepository.save(credentialsData);
  // }

  async getAuthUrl(scopes: string[], googleAppsId: number) {
    const authUrl = (await this.getOAuthClient(googleAppsId)).generateAuthUrl({
      access_type: 'offline',
      scope: scopesData.getScopes(scopes),
    });
    return authUrl;
  }
}
