import { PartialType } from '@nestjs/mapped-types';
import { CreateRepartitionKeyDto } from './create-repartition-key.dto';

export class UpdateRepartitionKeyDto extends PartialType(CreateRepartitionKeyDto) {} 