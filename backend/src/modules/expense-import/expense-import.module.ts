import { Module } from '@nestjs/common';
import { ExpenseImportController } from './expense-import.controller';
import { ExpenseImportService } from './expense-import.service';

@Module({
  controllers: [ExpenseImportController],
  providers: [ExpenseImportService],
})
export class ExpenseImportModule {}