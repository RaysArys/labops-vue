import { IsIn, IsOptional, IsString } from 'class-validator';

export class TinjauHasilDto {
  @IsIn(['setujui', 'tolak_dokumen', 'tolak_teknis', 'revisi'])
  action: 'setujui' | 'tolak_dokumen' | 'tolak_teknis' | 'revisi';

  @IsOptional()
  @IsString()
  alasan?: string;
}
