// src/attendance/attendance.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { Between, Repository } from 'typeorm';
import { AttendanceDto } from './attendance.dto';
import { Karyawan } from '../karyawan/karyawan.entity';
import { getDistanceInMeters } from '../helpers/gps-helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AttendanceService {
  private readonly officeLatitude: number;
  private readonly officeLongitude: number;
  private readonly officeRadius: number;

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Karyawan)
    private karyawanRepo: Repository<Karyawan>,
    private configService: ConfigService,
  ) {
    
    // --- TAMBAHKAN KODE DEBUGGING INI ---
    console.log('--- MEMBACA .env DARI AttendanceService ---');
    console.log('DB_HOST:', this.configService.get<string>('DB_HOST'));
    console.log('JWT_SECRET:', this.configService.get<string>('JWT_SECRET'));
    console.log('OFFICE_LATITUDE:', this.configService.get<string>('OFFICE_LATITUDE'));
    console.log('OFFICE_LONGITUDE:', this.configService.get<string>('OFFICE_LONGITUDE'));
    console.log('OFFICE_RADIUS_METERS:', this.configService.get<string>('OFFICE_RADIUS_METERS'));
    console.log('---------------------------------------------');
    // --- END KODE DEBUGGING ---


    const lat = this.configService.get<string>('OFFICE_LATITUDE');
    const long = this.configService.get<string>('OFFICE_LONGITUDE');
    const radius = this.configService.get<string>('OFFICE_RADIUS_METERS');

    if (!lat || !long || !radius) {
      // Error ini akan tetap muncul jika variabel tidak terbaca
      throw new Error(
        'Variabel lokasi kantor (OFFICE_LATITUDE, OFFICE_LONGITUDE, OFFICE_RADIUS_METERS) belum diatur di file .env',
      );
    }
    
    this.officeLatitude = +lat;
    this.officeLongitude = +long;
    this.officeRadius = +radius;
  }

  // ... (Sisa file service tetap sama) ...

  // Helper untuk validasi
  private validateAttendance(dto: AttendanceDto) {
    if (dto.isMockLocation) {
      throw new ForbiddenException('Aplikasi Fake GPS terdeteksi. Absensi ditolak.');
    }
    const distance = getDistanceInMeters(
      dto.latitude,
      dto.longitude,
      this.officeLatitude,
      this.officeLongitude,
    );
    if (distance > this.officeRadius) {
      throw new BadRequestException(
        `Anda berada ${Math.round(distance)} meter dari kantor. Absensi ditolak.`,
      );
    }
  }
  
  private async getKaryawanByUserId(userId: string): Promise<Karyawan> {
     const karyawan = await this.karyawanRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!karyawan) {
      throw new NotFoundException('Data karyawan tidak ditemukan untuk pengguna ini.');
    }
    return karyawan;
  }

  private findTodaysAttendance(karyawanId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return this.attendanceRepo.findOne({
      where: {
        karyawan: { id: karyawanId },
        check_in_time: Between(todayStart, todayEnd),
      },
    });
  }

  async checkIn(userId: string, dto: AttendanceDto) {
    this.validateAttendance(dto);
    const karyawan = await this.getKaryawanByUserId(userId);
    const existingAttendance = await this.findTodaysAttendance(karyawan.id);
    if (existingAttendance) {
      throw new BadRequestException('Anda sudah melakukan absen masuk hari ini.');
    }

    const attendance = this.attendanceRepo.create({
      karyawan: karyawan,
      check_in_time: new Date(),
      check_in_latitude: dto.latitude,
      check_in_longitude: dto.longitude,
      status: AttendanceStatus.MASUK,
    });

    await this.attendanceRepo.save(attendance);
    return { message: 'Absen masuk berhasil.', time: attendance.check_in_time };
  }

  async checkOut(userId: string, dto: AttendanceDto) {
    this.validateAttendance(dto);
    const karyawan = await this.getKaryawanByUserId(userId);
    const attendance = await this.findTodaysAttendance(karyawan.id);
    if (!attendance) {
      throw new BadRequestException('Anda belum melakukan absen masuk hari ini.');
    }
    if (attendance.check_out_time) {
       throw new BadRequestException('Anda sudah melakukan absen pulang hari ini.');
    }

    attendance.check_out_time = new Date();
    attendance.check_out_latitude = dto.latitude;
    attendance.check_out_longitude = dto.longitude;
    attendance.status = AttendanceStatus.PULANG;

    await this.attendanceRepo.save(attendance);
    return { message: 'Absen pulang berhasil.', time: attendance.check_out_time };
  }
}