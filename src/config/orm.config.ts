// src/config/orm.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Karyawan } from '../karyawan/karyawan.entity';

export const ormConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get<string>('DATABASE_HOST', 'localhost'),
  port: parseInt(config.get<string>('DATABASE_PORT', '3308'), 10),
  username: config.get<string>('DATABASE_USER', 'root'),
  password: config.get<string>('DATABASE_PASSWORD', 'root'),
  database: config.get<string>('DATABASE_NAME', 'pt_pkl'),
  entities: [User, Karyawan],
  synchronize: true, // Jangan gunakan di production
});
