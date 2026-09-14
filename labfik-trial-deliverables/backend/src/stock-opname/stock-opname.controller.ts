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
import { StockOpnameService } from './stock-opname.service';
import { OpenPeriodeDto } from './dto/open-periode.dto';
import { InputHasilPemeriksaanDto } from './dto/input-hasil-pemeriksaan.dto';
import { DaftarkanAsetBaruDto } from './dto/daftarkan-aset-baru.dto';
import { TindakLanjutDto } from './dto/tindak-lanjut.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';

// Matriks akses modul Stock Opname (SRS bagian 2):
// - Laboran: full akses (buka/tutup periode, cari aset, input hasil, daftar aset baru)
// - Kepala Lab: view + tindak lanjut temuan
// - Teknisi/Tata Usaha/Wakil Dekan: view saja
@Controller('stock-opname')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockOpnameController {
  constructor(private readonly stockOpnameService: StockOpnameService) {}

  // ---- Periode ----
  @Get('periode')
  findAllPeriode() {
    return this.stockOpnameService.findAllPeriode();
  }

  @Get('periode/:id')
  findPeriode(@Param('id') id: string) {
    return this.stockOpnameService.findPeriode(id);
  }

  @Post('periode')
  @Roles(Role.LABORAN, Role.KEPALA_LAB)
  openPeriode(@Body() dto: OpenPeriodeDto, @CurrentUser() user: RequestUser) {
    return this.stockOpnameService.openPeriode(dto, user);
  }

  @Patch('periode/:id/tutup')
  @Roles(Role.LABORAN, Role.KEPALA_LAB)
  closePeriode(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.stockOpnameService.closePeriode(id, user);
  }

  // ---- Pencarian aset (FR-06, FR-07) ----
  @Get('search-asset')
  searchAsset(@Query('q') query: string) {
    return this.stockOpnameService.searchAsset(query ?? '');
  }

  // ---- Input pemeriksaan ----
  @Post('periode/:periodeId/pemeriksaan')
  @Roles(Role.LABORAN)
  inputHasilPemeriksaan(
    @Param('periodeId') periodeId: string,
    @Body() dto: InputHasilPemeriksaanDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.stockOpnameService.inputHasilPemeriksaan(periodeId, dto, user);
  }

  @Post('periode/:periodeId/aset-baru')
  @Roles(Role.LABORAN)
  daftarkanAsetBaru(
    @Param('periodeId') periodeId: string,
    @Body() dto: DaftarkanAsetBaruDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.stockOpnameService.daftarkanAsetBaru(periodeId, dto, user);
  }

  @Get('periode/:periodeId/records')
  findRecordsByPeriode(@Param('periodeId') periodeId: string) {
    return this.stockOpnameService.findRecordsByPeriode(periodeId);
  }

  // ---- Tindak lanjut (FR-11) ----
  @Patch('records/:recordId/tindak-lanjut')
  @Roles(Role.KEPALA_LAB)
  tindakLanjut(
    @Param('recordId') recordId: string,
    @Body() dto: TindakLanjutDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.stockOpnameService.tindakLanjut(recordId, dto, user);
  }
}
