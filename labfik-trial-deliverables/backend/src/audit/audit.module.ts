import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemConfigurationChange } from './item-configuration-change.entity';
import { AuditService } from './audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemConfigurationChange])],
  providers: [AuditService],
  exports: [AuditService], // di-export supaya AssetsModule, CalibrationModule, dll bisa pakai
})
export class AuditModule {}
