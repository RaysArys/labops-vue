import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransitionWorkOrderDto {
  @IsIn(['mulai_kerjakan', 'selesaikan', 'buka_kembali', 'tutup', 'batalkan'])
  action:
    | 'mulai_kerjakan'
    | 'selesaikan'
    | 'buka_kembali'
    | 'tutup'
    | 'batalkan';

  // Diisi saat 'selesaikan' — opsional untuk aksi lain.
  @IsOptional()
  @IsString()
  catatan_perbaikan?: string;

  @IsOptional()
  @IsNumber()
  biaya?: number;

  @IsOptional()
  @IsNumber()
  downtime_jam?: number;
}
