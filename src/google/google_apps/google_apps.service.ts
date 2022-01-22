import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { GoogleApps } from '../entities/google_apps.entity';

export type CredentialsData = {
  name: string;
  scopes: string;
  client_secret: string;
  client_id: string;
  api_key?: string;
  redirect_uri: string;
}

@Injectable()
export class GoogleAppsService {
  constructor(
    @InjectRepository(GoogleApps)
    private readonly usersRepository: Repository<GoogleApps>,
  ) {}

  async saveCredentials(credentialsData: CredentialsData) {
    credentialsData.api_key = hashSync(JSON.stringify(credentialsData), 9);
    return this.usersRepository.save(credentialsData);
  }
}
