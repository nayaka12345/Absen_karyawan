import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    // ---- PERUBAHAN DI SINI ----
    super({ usernameField: 'username', passwordField: 'password' });
  }

  // ---- DAN DI SINI ----
  async validate(username: string, password: string) {
    // Sekarang memvalidasi berdasarkan username
    return this.auth.validateUser(username, password);
  }
}