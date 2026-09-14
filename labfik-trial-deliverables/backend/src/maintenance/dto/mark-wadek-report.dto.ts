import { IsBoolean } from 'class-validator';

export class MarkWadekReportDto {
  @IsBoolean()
  dikirim: boolean;
}
