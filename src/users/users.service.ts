import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByUsernameForAuth(username: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password') // Penting: Ambil password
      .where('user.username = :username', { username })
      .getOne();
  }

  // --- FUNGSI BARU ---
  async findByEmailForAuth(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password') // Penting: Ambil password
      .where('user.email = :email', { email })
      .getOne();
  }
  // --- END FUNGSI BARU ---

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

   async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(data: CreateUserDto): Promise<User> {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.repo.create({
      ...data,
      password: hashedPassword,
    });
    return this.repo.save(user);
  }

  async findOrFail(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}