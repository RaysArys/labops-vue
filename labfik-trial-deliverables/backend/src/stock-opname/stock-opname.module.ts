import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOpnamePeriod } from './stock-opname-period.entity';
import { StockOpnameRecord } from './stock-opname-record.entity';
import { Asset } from '../assets/asset.entity';
import { StockOpnameService } from './stock-opname.service';
import { StockOpnameController } from './stock-opname.controller';
import { AssetsModule } from '../assets/assets.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOpnamePeriod, StockOpnameRecord, Asset]),
    AssetsModule,
    MaintenanceModule,
    AuditModule,
  ],
  controllers: [StockOpnameController],
  providers: [StockOpnameService],
})
export class StockOpnameModule {}
