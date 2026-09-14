import { IsDateString, IsOptional, IsString } from 'class-validator';

export class OpenPeriodeDto {
  @IsDateString()
  tanggal_mulai: string;

  @IsOptional()
  @IsString()
  cakupan_lokasi?: string;
}
