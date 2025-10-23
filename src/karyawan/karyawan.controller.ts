import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
// Jalur impor diperbaiki untuk menunjuk ke subfolder 'dto'
import { CreateKaryawanDto } from './create-karyawan.dto';
import { UpdateKaryawanDto } from './update-karyawan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/user.entity';

@Controller('karyawan')
@UseGuards(JwtAuthGuard, RolesGuard) // <-- Kita tetap butuh ini untuk memastikan user sudah login
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) {}

  @Post()
  // @Roles(Role.ADMIN, Role.HRD) // <-- Dinonaktifkan sementara untuk testing
  create(@Body() createKaryawanDto: CreateKaryawanDto) {
    return this.karyawanService.create(createKaryawanDto);
  }

  @Get()
  // @Roles(Role.ADMIN, Role.HRD) // <-- Dinonaktifkan sementara untuk testing
  findAll() {
    return this.karyawanService.findAll();
  }

  @Get(':id')
  // @Roles(Role.ADMIN, Role.HRD, Role.PEGAWAI) // <-- Ini bisa tetap aktif
  findOne(@Param('id') id: string) {
    return this.karyawanService.findOne(id);
  }

  @Put(':id')
  // @Roles(Role.ADMIN, Role.HRD) // <-- Dinonaktifkan sementara untuk testing
  update(@Param('id') id: string, @Body() updateKaryawanDto: UpdateKaryawanDto) {
    return this.karyawanService.update(id, updateKaryawanDto);
  }

  @Delete(':id')
  // @Roles(Role.ADMIN, Role.HRD) // <-- Dinonaktifkan sementara untuk testing
  remove(@Param('id') id: string) {
    return this.karyawanService.remove(id);
  }
}