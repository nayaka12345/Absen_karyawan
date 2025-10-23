import { IsString, IsNotEmpty, IsDateString, IsEnum, IsPhoneNumber } from 'class-validator';
import { JenisKelamin } from './karyawan.entity';

export class CreateKaryawanDto {
  @IsString()
  @IsNotEmpty()
  nama_lengkap: string;

  @IsString()
  @IsNotEmpty()
  alamat: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal_lahir: string;

  @IsString()
  @IsNotEmpty()
  divisi: string;

  @IsEnum(JenisKelamin)
  @IsNotEmpty()
  jenis_kelamin: JenisKelamin;

  @IsPhoneNumber('ID')
  @IsNotEmpty()
  nomor_telepon: string;
}