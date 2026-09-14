import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor]), AuditModule],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService], // dipakai CalibrationModule nanti (vendor_id di CalibrationLog) & DashboardModule
})
export class VendorsModule {}
