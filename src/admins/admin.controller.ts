import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/gurads/jwt-auth.guard';
import { CreateAdminDto } from './create-admin.dto';
import { Admins } from './admins.entity';
import { AdminsService } from './admins.service';
import { AuthService } from 'src/auth/auth.service';

export type authData = {
  login: string;
  pswd: string;
};

type Admin = {
  id: number;
  login: string;
  name: string;
  access_type: string;
  rights: string;
  partner_id: number;
};

@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUser(@Request() req) {
    const admin: Admin = await this.adminService.getAdminById(req.admin.id);
    if (!JSON.parse(admin.rights).viewPage)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return {
      id: admin.id,
      name: admin.name,
      login: admin.login,
      rights: admin.rights,
      access_type: admin.access_type,
      partner_id: admin.partner_id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('widgets')
  async getWidgets(@Request() req) {
    const admin: Admin = await this.adminService.getAdminById(req.admin.id);
    if (!JSON.parse(admin.rights).widgets)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return {
      id: admin.id,
      name: admin.name,
      login: admin.login,
      rights: admin.rights,
      access_type: admin.access_type,
      partner_id: admin.partner_id,
    };
  }

  @Put(':id')
  updateAdmin(@Query() data: object, @Param('id') id: number): void {
    this.adminService.updateAdmin(id, data);
  }

  @Post()
  async create(@Req() query) {
    console.log(query);
    const admin: Admins = await this.adminService.createAdmin(query.body);
    const refresh_token = this.authService.getCookieWithJwtAccessToken(admin.id, admin.login);
    const tokens = {
      refresh_token,
      access_token: this.authService.getCookieWithJwtAccessToken(admin.id, admin.login),
    }
    
    this.adminService.updateAdmin(admin.id, { refresh_token });

    return tokens;
  }

  @Delete(':id')
  removeById(@Param('id') id: string): string {
    return id;
  }
}
