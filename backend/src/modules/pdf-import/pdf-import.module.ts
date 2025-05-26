import { Module } from '@nestjs/common';
import { PdfImportController } from './pdf-import.controller';
import { PdfOcrService } from './pdf-ocr.service';
import { PdfExpenseParserService } from './pdf-expense-parser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../../entities/expense.entity';
import { BuildingsModule } from '../buildings/buildings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), BuildingsModule],
  controllers: [PdfImportController],
  providers: [PdfOcrService, PdfExpenseParserService],
  exports: [],
})
export class PdfImportModule {}