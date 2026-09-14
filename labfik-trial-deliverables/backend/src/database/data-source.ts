import 'reflect-metadata';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { ItemConfigurationChange } from '../audit/item-configuration-change.entity';
import { CalibrationLog } from '../calibration/calibration-log.entity';
import { CalibrationSchedule } from '../calibration/calibration-schedule.entity';
import { CalibrationParameter } from '../calibration/calibration-parameter.entity';
import { WorkOrder } from '../maintenance/work-order.entity';
import { StockOpnamePeriod } from '../stock-opname/stock-opname-period.entity';
import { StockOpnameRecord } from '../stock-opname/stock-opname-record.entity';
import { User } from '../users/user.entity';
import { Vendor } from '../vendors/vendor.entity';

// DataSource khusus TypeORM CLI. Daftar entity dibuat eksplisit agar generate
// migration selalu memakai sembilan source of truth yang sama dengan aplikasi.
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'labfik_inventory',
  entities: [
    User,
    Asset,
    ItemConfigurationChange,
    WorkOrder,
    StockOpnamePeriod,
    StockOpnameRecord,
    CalibrationSchedule,
    CalibrationLog,
    CalibrationParameter,
    Vendor,
  ],
  // Glob membuat migration hasil `typeorm:generate` berikutnya otomatis ikut
  // ditemukan, baik saat CLI menjalankan source .ts maupun build .js.
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
});
