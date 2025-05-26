import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as pdf from 'pdf-parse';

@Injectable()
export class PdfOcrService {
  async extractTextFromPdf(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    // Si le PDF contient du texte natif
    if (data.text && data.text.trim().length > 0) {
      return data.text;
    }
    // Sinon, extraire les images et passer à Tesseract (à implémenter)
    // Pour l’exemple, on retourne le texte brut
    return '';
  }
  async extractTextFromImage(imagePath: string): Promise<string> {
    const result = await Tesseract.recognize(imagePath, 'fra');
    return result.data.text;
  }
}