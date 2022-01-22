import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './create-admin.dto';
import { authData } from './admin.controller';
import { Admins } from './admins.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admins)
    private readonly adminsRepository: Repository<Admins>,
  ) {}

  createAdmin(admin: CreateAdminDto): Promise<Admins> {
    const newAdmin = this.adminsRepository.create({
      name: admin.name,
      login: admin.login,
      password: admin.password,
      pswd: admin.pswd,
      access_type: admin.access_type,
      partner_id: admin.partner_id,
      rights: admin.rights,
    });
    return this.adminsRepository.save(newAdmin);
  }

  getAllAdmins(): Promise<Admins[]> {
    return this.adminsRepository.find();
  }

  async getAdminById(id: number) {
    return this.adminsRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.adminsRepository.delete(id);
  }

  // updateUser(user: CreateUserDto): Promise<Users> {
  //   user.id = +user.id;
  //   return this.usersRepository.save(user);
  // }

  async updateAdmin(adminId: number, data: object) {
    await this.adminsRepository.update(adminId, data);
  }

  async getAdminByAuthData(authData: authData): Promise<Admins | boolean> {
    const admins = await this.getAllAdmins();
    for (const admin in admins) {
      if (
        admins[admin].login === authData.login &&
        admins[admin].pswd === authData.pswd
      ) {
        return admins[admin];
      }
    }
    return false;
  }

  async getAdminByLogin(login: string): Promise<Admins | undefined> {
    const admins = await this.getAllAdmins();
    for (const admin in admins) {
      if (admins[admin].login === login) {
        return admins[admin];
      }
    }
    return null;
  }

  async setRefreshToken(refresToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refresToken, 10);
    this.updateAdmin(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async getAdminIfRefreshTokenMatches(refreshToken: string, adminId: number) {
    const admin = await this.getAdminById(adminId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      admin.refresh_token,
    );

    if (isRefreshTokenMatching) {
      return admin;
    }
  }
}
