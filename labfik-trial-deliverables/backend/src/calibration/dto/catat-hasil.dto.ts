import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HasilKalibrasi } from '../enums/calibration-status.enum';

export class InputPengukuranDto {
  @IsString()
  parameter_id: string;

  @IsNumber()
  nilai_aktual: number;
}

export class CatatHasilDto {
  @IsDateString()
  tanggal_pelaksanaan: string;

  @IsOptional()
  @IsEnum(HasilKalibrasi)
  hasil?: HasilKalibrasi;

  @IsOptional()
  @IsArray()
  @ArrayUnique((item: InputPengukuranDto) => item.parameter_id)
  @ValidateNested({ each: true })
  @Type(() => InputPengukuranDto)
  pengukuran?: InputPengukuranDto[];

  @IsOptional()
  @IsString()
  deviasi?: string;

  @IsOptional()
  @IsNumber()
  biaya?: number;

  @IsOptional()
  @IsString()
  vendor_id?: string;
}
