// Kemungkinan di file: src/users/dto/register.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString()
  nama: string; // <-- PASTIKAN FIELD INI ADA

  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail()
  email: string; // <-- PASTIKAN FIELD INI ADA

  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;
}