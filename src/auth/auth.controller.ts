import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guards';
import { Role, User } from '../users/user.entity';
import { RegisterDto } from '../users/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
async register(@Body() dto: RegisterDto) {
  return this.auth.register(dto);
}


  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() _dto: LoginDto, @Req() req: any) {
    return this.auth.login(req.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return { ok: true, message: 'Only ADMIN can access' };
  }

  @Get('hrd-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HRD)
  hrdOnly() {
    return { ok: true, message: 'Only HRD can access' };
  }

  @Get('pegawai-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PEGAWAI)
  pegawaiOnly() {
    return { ok: true, message: 'Only PEGAWAI can access' };
  }
}
