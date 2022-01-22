import { Admins } from 'src/admins/admins.entity';
import { GoogleApps } from 'src/google/entities/google_apps.entity';
import { GoogleOauth } from 'src/google/entities/google_oauth.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'vladislav',
  password: 'root1234',
  database: 'core',
  entities: [Admins, GoogleApps, GoogleOauth],
  synchronize: true,
};

export default config;
