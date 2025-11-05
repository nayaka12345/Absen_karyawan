// src/attendance/attendance.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Karyawan } from '../karyawan/karyawan.entity';

export enum AttendanceStatus {
  MASUK = 'MASUK',
  PULANG = 'PULANG',
  TERLAMBAT = 'TERLAMBAT',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Karyawan, (karyawan) => karyawan.attendances)
  karyawan: Karyawan;

  @Column({ type: 'timestamp' })
  check_in_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out_time: Date | null;

  @Column('decimal', { precision: 10, scale: 7 })
  check_in_latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  check_in_longitude: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  check_out_latitude: number | null;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  check_out_longitude: number | null;
  
  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.MASUK })
  status: AttendanceStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}