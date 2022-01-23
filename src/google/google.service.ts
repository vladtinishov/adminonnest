import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { clientSecret } from 'client_secret';
import { google } from 'googleapis';
import { scopesData } from './constants/scopes';

type User = {
  data: object
}

type Tokens = {
  access_token: string,
  refresh_token: string,
  scope: string,
  token_type: string,
  id_token: string,
  expiry_date: number
}

@Injectable()
export class GoogleService {
  private oAuth2Client;

  constructor() {
    const {client_secret, client_id, redirect_uris} = clientSecret.web;
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  }

  async refreshAccessToken(refresh_token) {
    this.oAuth2Client.setCredentials({refresh_token});
    return await this.oAuth2Client.getAccessToken();
  }

  authorize(token: string) {
    this.oAuth2Client.setCredentials(JSON.parse(token));
  }

  getAccessToken(code: string) {
    return new Promise((resolve) => {
      this.oAuth2Client.getToken(code, async (err: object, tokens: Tokens) => {
        const b = await this.oAuth2Client.setCredentials(tokens);
        console.log(b);
        const users = await this.getUserInfo(tokens.access_token);
        resolve({...tokens, ...users});
      });
    })
  }

  getAuthUrl(scopes: string[]) {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopesData.getScopes(scopes),
    });
    return authUrl;
  }

  async getUserInfo(access_token) {
    const promise: Promise<User> = new Promise((resolve) => {
      this.oAuth2Client.setCredentials({access_token});
      const oauth2 = google.oauth2({
        auth: this.oAuth2Client,
        version: 'v2'
      });
      oauth2.userinfo.get((err, res) => {
        console.log(res);
        resolve(res);
      });
    });
    const data = await promise;
    return data?.data;
  }
}
