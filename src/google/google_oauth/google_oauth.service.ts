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

export type GoogleAppId = number;


@Injectable()
export class GoogleOAuthService {
  constructor(
    @InjectRepository(GoogleApps)
    private readonly usersRepository: Repository<GoogleApps>,
  ) {}

  async getOAuthClient(credentials) {
    const { client_id, client_secret, redirect_uri } = credentials;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  }

  // saveOauth(oauthData: OauthData) {
  //   credentialsData.api_key = hashSync(JSON.stringify(credentialsData), 9);
  //   return this.usersRepository.save(credentialsData);
  // }

  async getAuthUrl(googleAppsId: GoogleAppId) {
    const credentials = await this.usersRepository.findOne(googleAppsId);
    const scopes = credentials.scopes.split(',');
    console.log(scopes);
    const authUrl = (await this.getOAuthClient(credentials)).generateAuthUrl({
      access_type: 'offline',
      scope: scopesData.getScopes(scopes),
    });
    return authUrl;
  }
}
