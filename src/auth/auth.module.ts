import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // --- PERUBAHAN UTAMA DI SINI ---
    // Kita tidak menggunakan ConfigService untuk sementara
    JwtModule.register({
      secret: 'INI_ADALAH_KUNCI_RAHASIA_SAYA_YANG_SANGAT_AMAN', // <-- Hardcode secret di sini
      signOptions: { expiresIn: '1d' },
    }),
  ],
  // Pastikan JwtStrategy masih bisa mengakses secret
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService) => {
        return new JwtStrategy(configService);
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}