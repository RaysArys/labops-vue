import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WorkOrderAsalTemuan } from '../enums/work-order-status.enum';

export class CreateWorkOrderDto {
  @IsString()
  @IsNotEmpty()
  asset_id: string;

  @IsString()
  @IsNotEmpty()
  deskripsi_kerusakan: string;

  @IsOptional()
  @IsEnum(WorkOrderAsalTemuan)
  asal_temuan?: WorkOrderAsalTemuan;

  @IsOptional()
  @IsString()
  referensi_asal_id?: string;
}
