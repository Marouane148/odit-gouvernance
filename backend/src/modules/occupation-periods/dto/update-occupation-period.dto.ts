import { PartialType } from '@nestjs/swagger';
import { CreateOccupationPeriodDto } from './create-occupation-period.dto';

export class UpdateOccupationPeriodDto extends PartialType(CreateOccupationPeriodDto) {}