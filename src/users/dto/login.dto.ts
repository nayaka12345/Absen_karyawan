// src/users/dto/login.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsOptional() // Jadi opsional
  @IsEmail()
  email?: string; // Tambah tanda tanya (?)

  @IsOptional() // Jadi opsional
  @IsString()
  username?: string; // Tambah tanda tanya (?)

  @IsString()
  @MinLength(6) // Sesuaikan jika perlu
  password: string;
}