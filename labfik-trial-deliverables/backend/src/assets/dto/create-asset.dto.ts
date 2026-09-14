import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AssetKategori } from '../enums/asset-status.enum';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  nama_aset: string;

  @IsEnum(AssetKategori)
  kategori: AssetKategori;

  @IsOptional()
  @IsString()
  subkategori?: string;

  @IsOptional()
  @IsString()
  merek?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serial_number?: string;

  @IsOptional()
  @IsString()
  no_inventaris?: string;

  @IsOptional()
  @IsNumber()
  tahun_perolehan?: number;

  @IsOptional()
  @IsNumber()
  qty_sistem?: number;

  @IsOptional()
  @IsString()
  satuan?: string;

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
  @IsString()
  rak?: string;

  @IsOptional()
  @IsString()
  pic_pengguna?: string;

  @IsOptional()
  @IsString()
  unit_pemilik?: string;

  // Isi bebas sesuai kategori, lihat contoh struktur di asset.entity.ts
  @IsOptional()
  @IsObject()
  atribut_kategori?: Record<string, unknown>;
}
