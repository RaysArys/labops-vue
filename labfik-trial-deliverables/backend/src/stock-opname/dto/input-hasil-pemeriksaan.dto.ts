import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { KondisiFisik } from '../enums/stock-opname.enum';

export class InputHasilPemeriksaanDto {
  @IsString()
  @IsNotEmpty()
  asset_id: string;

  @IsEnum(KondisiFisik)
  kondisi_fisik: KondisiFisik;

  @IsOptional()
  @IsString()
  lokasi_aktual?: string;

  @IsNumber()
  qty_fisik: number;
}
