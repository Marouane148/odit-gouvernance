import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegularizationHistory } from '../../entities/regularization-history.entity';
import { RegularizationHistoryService } from './regularization-history.service';
import { RegularizationHistoryController } from './regularization-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegularizationHistory])],
  providers: [RegularizationHistoryService],
  controllers: [RegularizationHistoryController],
  exports: [RegularizationHistoryService],
})
export class RegularizationHistoryModule {}


