import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CatatHasilDto } from './dto/catat-hasil.dto';
import { TinjauHasilDto } from './dto/tinjau-hasil.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { CreateCalibrationParameterDto } from './dto/create-parameter.dto';
import { UpdateCalibrationParameterDto } from './dto/update-parameter.dto';
import { AssetKategori } from '../assets/enums/asset-status.enum';

// Matriks akses modul Kalibrasi (SRS bagian 2):
// - Laboran: input hasil, upload sertifikat
// - Kepala Lab: view + approve/reject hasil
// - Teknisi/Tata Usaha/Wakil Dekan: view saja
@Controller('calibration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  // ---- Master parameter ----
  @Get('parameters')
  @Roles(Role.LABORAN, Role.KEPALA_LAB)
  findParameters(
    @Query('kategori') kategori?: AssetKategori,
    @Query('include_inactive') includeInactive?: string,
  ) {
    return this.calibrationService.findParameters(
      kategori,
      includeInactive === 'true',
    );
  }

  @Post('parameters')
  @Roles(Role.KEPALA_LAB)
  createParameter(
    @Body() dto: CreateCalibrationParameterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.calibrationService.createParameter(dto, user);
  }

  @Patch('parameters/:id')
  @Roles(Role.KEPALA_LAB)
  updateParameter(
    @Param('id') id: string,
    @Body() dto: UpdateCalibrationParameterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.calibrationService.updateParameter(id, dto, user);
  }

  // ---- Jadwal ----
  @Get('schedules')
  findAllSchedules() {
    return this.calibrationService.findAllSchedules();
  }

  @Get('schedules/:id')
  findSchedule(@Param('id') id: string) {
    return this.calibrationService.findSchedule(id);
  }

  @Post('schedules')
  @Roles(Role.LABORAN, Role.KEPALA_LAB)
  createSchedule(
    @Body() dto: CreateScheduleDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.calibrationService.createSchedule(dto, user);
  }

  // Untuk sekarang dipicu manual — di produksi disambungkan ke cron job
  // harian (lihat catatan di calibration.service.ts).
  @Patch('schedules/:id/refresh-status')
  refreshStatusJadwal(@Param('id') id: string) {
    return this.calibrationService.refreshStatusJadwal(id);
  }

  @Patch('schedules/:id/selesaikan-perbaikan')
  @Roles(Role.TEKNISI, Role.KEPALA_LAB)
  selesaikanPerbaikan(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.calibrationService.selesaikanPerbaikanKembaliKeJadwal(id, user);
  }

  // ---- Log hasil kalibrasi ----
  @Get('logs/:id')
  findLog(@Param('id') id: string) {
    return this.calibrationService.findLog(id);
  }

  @Get('schedules/:scheduleId/logs')
  findLogsBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.calibrationService.findLogsBySchedule(scheduleId);
  }

  @Post('schedules/:scheduleId/catat-hasil')
  @Roles(Role.LABORAN)
  catatHasil(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: CatatHasilDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.calibrationService.catatHasil(scheduleId, dto, user);
  }

  @Patch('logs/:id/tinjau')
  @Roles(Role.KEPALA_LAB)
  tinjauHasil(
    @Param('id') id: string,
    @Body() dto: TinjauHasilDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.calibrationService.tinjauHasil(id, dto, user);
  }
}
