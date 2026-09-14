import { IsEnum } from 'class-validator';
import { WorkOrderPrioritas } from '../enums/work-order-status.enum';

export class SetPrioritasDto {
  @IsEnum(WorkOrderPrioritas)
  prioritas: WorkOrderPrioritas;
}
