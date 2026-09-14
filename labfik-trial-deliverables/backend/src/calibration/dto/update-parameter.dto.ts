import { PartialType } from '@nestjs/mapped-types';
import { CreateCalibrationParameterDto } from './create-parameter.dto';

export class UpdateCalibrationParameterDto extends PartialType(
  CreateCalibrationParameterDto,
) {}
