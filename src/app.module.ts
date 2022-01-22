import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleModule } from './google/google.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GoogleModule,
    // AdminsModule,
    // AuthModule,
    TypeOrmModule.forRoot(config),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
