import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AdminsController } from './admin.controller';
import { Admins } from './admins.entity';
import { AdminsService } from './admins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
