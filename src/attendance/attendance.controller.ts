// src/attendance/attendance.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttendanceDto } from './attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard) // Lindungi semua endpoint di controller ini
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  checkIn(@Req() req: any, @Body() dto: AttendanceDto) {
    // req.user.id didapat dari token JWT
    return this.attendanceService.checkIn(req.user.id, dto);
  }

  @Post('check-out')
  checkOut(@Req() req: any, @Body() dto: AttendanceDto) {
    // req.user.id didapat dari token JWT
    return this.attendanceService.checkOut(req.user.id, dto);
  }
}