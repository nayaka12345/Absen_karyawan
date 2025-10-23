import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../users/dto/register.dto';
import { Role, User } from '../users/user.entity';

@Injectable()
export class AuthService {
  // --- CONSTRUCTOR YANG HILANG ADA DI SINI ---
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.users.findByUsernameForAuth(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Kredensial tidak valid');
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role, username: user.username };
    return {
      access_token: this.jwt.sign(payload),
      user,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.users.findByUsername(dto.username);
    if (existing) {
      throw new BadRequestException('Username sudah digunakan');
    }

    const newUser = await this.users.create({
      ...dto,
      role: Role.PEGAWAI,
    });

    const { password, ...userWithoutPassword } = newUser;
    const payload = { sub: newUser.id, role: newUser.role, username: newUser.username };
    
    return {
      access_token: this.jwt.sign(payload),
      user: userWithoutPassword,
    };
  }
}