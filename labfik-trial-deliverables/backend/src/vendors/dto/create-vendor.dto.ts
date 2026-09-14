import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  nama_vendor: string;

  @IsOptional()
  @IsString()
  kontak?: string;

  @IsOptional()
  @IsString()
  no_akreditasi?: string;

  @IsOptional()
  @IsDateString()
  tanggal_expired_akreditasi?: string;
}
