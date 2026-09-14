import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AssetKategori } from '../../assets/enums/asset-status.enum';

// Filter lintas-widget Dashboard (SRS Dashboard).
// Rentang tanggal diterapkan pada tanggal bisnis masing-masing data:
// jatuh tempo kalibrasi/vendor, tanggal pelaksanaan kalibrasi, dan waktu
// penyelesaian/updated_at Work Order.
export class DashboardFilterDto {
  @IsOptional()
  @IsString()
  gedung?: string;

  @IsOptional()
  @IsString()
  lantai?: string;

  @IsOptional()
  @IsString()
  ruangan?: string;

  @IsOptional()
  @IsEnum(AssetKategori)
  kategori?: AssetKategori;

  @IsOptional()
  @IsDateString()
  tanggal_mulai?: string;

  @IsOptional()
  @IsDateString()
  tanggal_selesai?: string;
}
