import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrder } from './work-order.entity';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { AuditModule } from '../audit/audit.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder]), AuditModule, AssetsModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  // Di-export supaya StockOpnameModule & CalibrationModule bisa panggil
  // createFromEscalation() langsung sebagai service, sesuai flow eskalasi
  // "temuan rusak -> buat Work Order otomatis".
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
