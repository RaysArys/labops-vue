import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

// Dashboard murni read-only (SRS Dashboard): semua role terautentikasi boleh
// membuka endpoint. Perbedaan full/terbatas divalidasi di DashboardService,
// bukan @Roles(), karena seluruh endpoint sama-sama dibutuhkan semua role.
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getOverview(
    @Query() filter: DashboardFilterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardService.getOverview(filter, user);
  }

  @Get('kpi')
  getKpi(
    @Query() filter: DashboardFilterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardService.getKpi(filter, user);
  }

  @Get('grafik/distribusi-aset')
  getAssetDistribution(
    @Query() filter: DashboardFilterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardService.getAssetDistribution(filter, user);
  }

  @Get('grafik/tren-kalibrasi')
  getCalibrationTrend(
    @Query() filter: DashboardFilterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardService.getCalibrationTrend(filter, user);
  }

  @Get('grafik/biaya-maintenance')
  getMaintenanceCost(
    @Query() filter: DashboardFilterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardService.getMaintenanceCost(filter, user);
  }

  @Get('perlu-perhatian')
  getAttention(
    @Query() filter: DashboardFilterDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.dashboardService.getAttention(filter, user);
  }
}
