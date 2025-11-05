import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './src/users/user.entity';
import { Karyawan } from './src/karyawan/karyawan.entity';
import { Attendance } from './src/attendance/attendance.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3308', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Karyawan, Attendance],
  migrations: ['migrations/*.ts'],
});
