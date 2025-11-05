import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    // Kita tetap pakai usernameField, tapi akan fleksibel di validate
    super({ usernameField: 'username', passwordField: 'password', passReqToCallback: true });
  }

  async validate(req: any, usernameFromDto: string, password: string) {
    // --- PERUBAHAN DI SINI ---
    const { email, username } = req.body; // Ambil email dan username dari body

    // Tentukan identifier: prioritaskan username, jika tidak ada, gunakan email
    const identifier = username || email;

    if (!identifier) {
      throw new BadRequestException('Harap masukkan username atau email.');
    }

    // Kirim identifier (bisa email/username) ke AuthService
    return this.auth.validateUser(identifier, password);
    // --- END PERUBAHAN ---
  }
}