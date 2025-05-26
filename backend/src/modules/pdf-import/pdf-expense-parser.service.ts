import { Injectable } from '@nestjs/common';

export interface ParsedExpense {
  date: string;
  label: string;
  amount: number;
}

@Injectable()
export class PdfExpenseParserService {
  parseExpenses(ocrText: string): ParsedExpense[] {
    const lines = ocrText.split(/\r?\n/);
    const expenses: ParsedExpense[] = [];
    const expenseRegex = /(?<date>\d{2}\/\d{2}\/\d{4})\s+(?<label>.+?)\s+(?<amount>-?\d+[\.,]\d{2})/;
    for (const line of lines) {
      const match = expenseRegex.exec(line);
      if (match && match.groups) {
        expenses.push({
          date: match.groups.date,
          label: match.groups.label.trim(),
          amount: parseFloat(match.groups.amount.replace(',', '.')),
        });
      }
    }
    return expenses;
  }
}