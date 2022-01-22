import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admins {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  pswd: string;

  @Column()
  access_type: string;

  @Column()
  partner_id: number;

  @Column()
  rights: string;

  @Column({ default: '' })
  refresh_token: string;
}
