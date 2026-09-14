import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../assets/asset.entity';
import { CalibrationLog } from '../calibration/calibration-log.entity';
import { CalibrationSchedule } from '../calibration/calibration-schedule.entity';
import { WorkOrder } from '../maintenance/work-order.entity';
import { StockOpnameRecord } from '../stock-opname/stock-opname-record.entity';
import { Vendor } from '../vendors/vendor.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

// Tidak ada entity Dashboard: seluruh hasil adalah agregasi read-only dari
// tabel domain yang sudah menjadi source of truth. Dengan ini tidak ada data
// turunan yang berisiko stale dan tidak diperlukan migration baru.
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asset,
      WorkOrder,
      StockOpnameRecord,
      CalibrationSchedule,
      CalibrationLog,
      Vendor,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
