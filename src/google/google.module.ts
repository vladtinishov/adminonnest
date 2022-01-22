import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleAppsService } from './google_apps/google_apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleApps } from './entities/google_apps.entity';
import { GoogleOAuthService } from './google_oauth/google_oauth.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleApps])],
  providers: [GoogleService, GoogleAppsService, GoogleOAuthService],
  controllers: [GoogleController]
})
export class GoogleModule {}
