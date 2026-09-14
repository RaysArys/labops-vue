import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class TindakLanjutDto {
  @IsOptional()
  @IsString()
  pic_tindak_lanjut?: string;

  @IsOptional()
  @IsDateString()
  target_selesai?: string;

  @IsIn(['open', 'in_progress', 'selesai'])
  status_tindak_lanjut: 'open' | 'in_progress' | 'selesai';
}
