import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get<string>('DB_USERNAME', 'postgres'),
  password: config.get<string>('DB_PASSWORD', 'postgres'),
  database: config.get<string>('DB_NAME', 'labfik_inventory'),
  autoLoadEntities: true,
  // Produksi wajib migration-based. Jangan aktifkan synchronize karena
  // TypeORM dapat mengubah/drop struktur berdasarkan entity saat app start.
  synchronize: false,
  migrationsRun: false,
});
