import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleOauth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  google_app_id: number;

  @Column()
  google_users_id: number;

  @Column()
  google_users_email: number;

  @Column()
  google_users_picture: number;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  expiry_date: number;
}
