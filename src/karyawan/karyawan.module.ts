import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Karyawan } from './karyawan.entity';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Karyawan]), UsersModule],
  providers: [KaryawanService],
  controllers: [KaryawanController],
})
export class KaryawanModule {}