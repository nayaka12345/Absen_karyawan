import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Karyawan } from './karyawan.entity';
import { CreateKaryawanDto } from './create-karyawan.dto';
import { UpdateKaryawanDto } from './update-karyawan.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../users/user.entity';

@Injectable()
export class KaryawanService {
  constructor(
    @InjectRepository(Karyawan)
    private readonly karyawanRepository: Repository<Karyawan>,
    private readonly usersService: UsersService,
  ) {}

  async create(createKaryawanDto: CreateKaryawanDto): Promise<Karyawan> {
    const { nama_lengkap, tanggal_lahir } = createKaryawanDto;
    const username = nama_lengkap.replace(/\s/g, '').toLowerCase();
    const email = `${username}@kantor.com`;

    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException(`Username "${username}" sudah digunakan.`);
    }

    const newUser = await this.usersService.create({
      username,
      email,
      nama: nama_lengkap,
      password: tanggal_lahir,
      role: Role.PEGAWAI,
    });

    const karyawan = this.karyawanRepository.create({
      ...createKaryawanDto,
      user: newUser,
    });

    return this.karyawanRepository.save(karyawan);
  }

  findAll(): Promise<Karyawan[]> {
    return this.karyawanRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Karyawan> {
    const karyawan = await this.karyawanRepository.findOne({ where: { id }, relations: ['user'] });
    if (!karyawan) {
      throw new NotFoundException(`Karyawan with ID "${id}" not found`);
    }
    return karyawan;
  }

  async update(id: string, updateKaryawanDto: UpdateKaryawanDto): Promise<Karyawan> {
    // 'preload' lebih aman daripada 'findOne' + 'assign'
    const karyawanToUpdate = await this.karyawanRepository.preload({
      id: id,
      ...updateKaryawanDto,
    });
    if (!karyawanToUpdate) {
      throw new NotFoundException(`Karyawan with ID "${id}" not found`);
    }
    return this.karyawanRepository.save(karyawanToUpdate);
  }

  async remove(id: string): Promise<void> {
    const result = await this.karyawanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Karyawan with ID "${id}" not found`);
    }
  }
}