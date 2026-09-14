import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';

// Matriks akses modul Vendor (SRS bagian 2):
// - Tata Usaha: full CRUD
// - Teknisi/Laboran/Kepala Lab/Wakil Dekan: view saja
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  // Pembatasan "hanya Tata Usaha" divalidasi eksplisit di service (konsisten
  // dengan pola di AssetsService/MaintenanceService), @Roles di sini cukup
  // menutup akses role yang jelas-jelas tidak relevan sama sekali.
  @Post()
  @Roles(Role.TATA_USAHA)
  create(@Body() dto: CreateVendorDto, @CurrentUser() user: RequestUser) {
    return this.vendorsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.TATA_USAHA)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.vendorsService.update(id, dto, user);
  }

  // Untuk sekarang dipicu manual — di produksi disambungkan ke cron job
  // harian (lihat catatan di vendors.service.ts).
  @Patch(':id/refresh-status')
  refreshStatus(@Param('id') id: string) {
    return this.vendorsService.refreshStatusAkreditasi(id);
  }
}
