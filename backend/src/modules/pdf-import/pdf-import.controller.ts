import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PdfOcrService } from './pdf-ocr.service';
import { PdfExpenseParserService } from './pdf-expense-parser.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../entities/expense.entity';
import { BuildingsService } from '../buildings/buildings.service';
import { Body } from '@nestjs/common';

@Controller('pdf-import')
export class PdfImportController {
  constructor(
    private readonly pdfOcrService: PdfOcrService,
    private readonly pdfExpenseParserService: PdfExpenseParserService,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly buildingsService: BuildingsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body('buildingId') buildingId: string
  ) {
    try {
      if (!file) throw new BadRequestException('Aucun fichier reçu');
      if (!buildingId) throw new BadRequestException('Aucun bâtiment sélectionné');
      const building = await this.buildingsService.findOne(buildingId);
      const ocrText = await this.pdfOcrService.extractTextFromPdf(file.path);
      const expenses = this.pdfExpenseParserService.parseExpenses(ocrText);
      if (!expenses.length) {
        return { message: 'Aucune dépense détectée dans le PDF.' };
      }
      const savedExpenses = await Promise.all(
        expenses.map(e => this.expenseRepository.save({
          date: new Date(e.date),
          description: e.label,
          amount: e.amount,
          type: 'import_pdf',
          building,
          source: 'pdf_ocr', // exemple de métadonnée
        }))
      );
      return { savedExpenses };
    } catch (error) {
      throw new BadRequestException('Erreur lors du traitement du PDF : ' + error.message);
    }
  }
}