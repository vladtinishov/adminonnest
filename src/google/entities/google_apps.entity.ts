import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleApps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  scopes: string;

  @Column()
  client_secret: string;

  @Column()
  client_id: string;

  @Column()
  redirect_uri: string;

  @Column({ default: '' })
  api_key: string;
}
