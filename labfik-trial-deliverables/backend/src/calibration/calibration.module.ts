import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalibrationSchedule } from './calibration-schedule.entity';
import { CalibrationLog } from './calibration-log.entity';
import { CalibrationService } from './calibration.service';
import { CalibrationController } from './calibration.controller';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { AuditModule } from '../audit/audit.module';
import { CalibrationParameter } from './calibration-parameter.entity';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalibrationSchedule,
      CalibrationLog,
      CalibrationParameter,
    ]),
    MaintenanceModule,
    AuditModule,
    AssetsModule,
  ],
  controllers: [CalibrationController],
  providers: [CalibrationService],
})
export class CalibrationModule {}
