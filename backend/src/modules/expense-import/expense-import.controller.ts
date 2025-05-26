import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpenseImportService } from './expense-import.service';

@Controller('expense-import')
export class ExpenseImportController {
  constructor(private readonly expenseImportService: ExpenseImportService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.expenseImportService.parseExcel(file.buffer);
  }
}