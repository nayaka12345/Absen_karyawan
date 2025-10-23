import { IsString, IsOptional, IsDateString, IsEnum, IsPhoneNumber } from 'class-validator';
import { JenisKelamin } from './karyawan.entity';

export class UpdateKaryawanDto {
  @IsString()
  @IsOptional()
  nama_lengkap?: string;

  @IsString()
  @IsOptional()
  alamat?: string;

  @IsDateString()
  @IsOptional()
  tanggal_lahir?: string;

  @IsString()
  @IsOptional()
  divisi?: string;

  @IsEnum(JenisKelamin)
  @IsOptional()
  jenis_kelamin?: JenisKelamin;

  @IsPhoneNumber('ID')
  @IsOptional()
  nomor_telepon?: string;
}