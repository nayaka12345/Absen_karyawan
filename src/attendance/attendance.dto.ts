// src/attendance/dto/attendance.dto.ts
import { IsBoolean, IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class AttendanceDto {
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  /**
   * Flag ini dikirim dari frontend.
   * Frontend harus mendeteksi 'Mock Location' (Fake GPS) dan mengirim 'true' jika terdeteksi.
   */
  @IsNotEmpty()
  @IsBoolean()
  isMockLocation: boolean;
}