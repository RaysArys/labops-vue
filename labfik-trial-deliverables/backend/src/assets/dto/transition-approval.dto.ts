import { IsIn, IsOptional, IsString } from 'class-validator';

export class TransitionApprovalDto {
  @IsIn(['ajukan', 'setujui', 'tolak', 'revisi'])
  action: 'ajukan' | 'setujui' | 'tolak' | 'revisi';

  @IsOptional()
  @IsString()
  alasan?: string;
}
