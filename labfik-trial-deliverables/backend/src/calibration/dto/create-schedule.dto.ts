import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  asset_id: string;

  @IsInt()
  @Min(1)
  interval_bulan: number;

  // Opsional: kalau aset sudah pernah dikalibrasi sebelumnya (data migrasi
  // dari Excel lama). Kalau kosong, jadwal jatuh tempo dihitung dari hari ini.
  @IsOptional()
  @IsString()
  tanggal_kalibrasi_terakhir?: string;
}
