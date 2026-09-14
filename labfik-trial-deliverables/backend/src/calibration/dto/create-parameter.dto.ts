import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AssetKategori } from '../../assets/enums/asset-status.enum';

export class CreateCalibrationParameterDto {
  @IsEnum(AssetKategori)
  kategori_aset: AssetKategori;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  kode: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  nama_parameter: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  satuan: string;

  @IsOptional()
  @IsNumber()
  batas_min?: number | null;

  @IsOptional()
  @IsNumber()
  batas_max?: number | null;

  @IsOptional()
  @IsBoolean()
  aktif?: boolean;
}
