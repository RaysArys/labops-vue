import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { TransitionWorkOrderDto } from './dto/transition-work-order.dto';
import { SetPrioritasDto } from './dto/set-prioritas.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { MarkWadekReportDto } from './dto/mark-wadek-report.dto';

// Matriks akses modul Maintenance (SRS bagian 2):
// - Teknisi: full akses siklus tiket (view + kelola status)
// - Laboran: buat tiket (lapor kerusakan)
// - Kepala Lab: view + assign prioritas + tutup tiket
// - Tata Usaha, Wakil Dekan: view saja
@Controller('work-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.maintenanceService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.maintenanceService.findOne(id, user);
  }

  @Get(':id/laporan-kerusakan')
  @Roles(Role.KEPALA_LAB, Role.WAKIL_DEKAN)
  buildDamageReport(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.maintenanceService.buildDamageReport(id, user);
  }

  @Post()
  @Roles(Role.LABORAN)
  create(@Body() dto: CreateWorkOrderDto, @CurrentUser() user: RequestUser) {
    return this.maintenanceService.create(dto, user);
  }

  // Pembatasan lebih spesifik (Teknisi utk sebagian besar aksi, Teknisi/
  // Kepala Lab utk 'tutup') divalidasi di service — lihat komentar di
  // maintenance.service.ts.
  @Patch(':id/status')
  @Roles(Role.TEKNISI, Role.KEPALA_LAB)
  transitionStatus(
    @Param('id') id: string,
    @Body() dto: TransitionWorkOrderDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.maintenanceService.transitionStatus(id, dto.action, user, {
      catatan_perbaikan: dto.catatan_perbaikan,
      biaya: dto.biaya,
      downtime_jam: dto.downtime_jam,
    });
  }

  @Patch(':id/prioritas')
  @Roles(Role.KEPALA_LAB)
  setPrioritas(
    @Param('id') id: string,
    @Body() dto: SetPrioritasDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.maintenanceService.setPrioritas(id, dto.prioritas, user);
  }

  @Patch(':id/laporan-wadek')
  @Roles(Role.KEPALA_LAB)
  markReportToWadek(
    @Param('id') id: string,
    @Body() dto: MarkWadekReportDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.maintenanceService.markReportToWadek(id, dto.dikirim, user);
  }
}
