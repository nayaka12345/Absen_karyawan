import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // --- PERBAIKAN DI SINI ---
      // Pastikan secretOrKey sama persis dengan yang digunakan untuk sign
      secretOrKey: cfg.get<string>('JWT_SECRET') || 'INI_ADALAH_KUNCI_RAHASIA_SAYA_YANG_SANGAT_AMAN',
    });
  }

  async validate(payload: { sub: string; role: string; username: string }) {
    // Sesuaikan payload dengan apa yang Anda kirim saat login
    return { id: payload.sub, role: payload.role, username: payload.username };
  }
}