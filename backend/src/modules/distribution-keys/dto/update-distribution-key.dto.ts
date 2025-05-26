import { PartialType } from '@nestjs/swagger';
import { CreateDistributionKeyDto } from './create-distribution-key.dto';

export class UpdateDistributionKeyDto extends PartialType(CreateDistributionKeyDto) {}