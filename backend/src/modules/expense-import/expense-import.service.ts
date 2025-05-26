import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as pdfParse from 'pdf-parse';
// At the top, import needed repositories and types
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../entities/expense.entity';
import { Building } from '../../entities/building.entity';
import { DistributionKey } from '../../entities/distribution-key.entity';

@Injectable()
export class ExpenseImportService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(DistributionKey)
    private readonly distributionKeyRepository: Repository<DistributionKey>,
  ) {}
  async parseExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    const headers = rows[0].map((h: string) => h.trim().toLowerCase());
    const results: { imported: any[]; errors: { row: number; error: string; data: any; }[] } = { imported: [], errors: [] };
    for (const [i, row] of rows.slice(1).entries()) {
      const data: any = {};
      headers.forEach((h: string, idx: number) => { data[h] = row[idx]; });
      // Validation de base
      if (!data.description || !data.amount || !data.date || !data.type || !data.building) {
        results.errors.push({ row: i + 2, error: 'Champs obligatoires manquants', data });
        continue;
      }
      // Vérification du montant
      if (isNaN(parseFloat(data.amount))) {
        results.errors.push({ row: i + 2, error: 'Montant invalide', data });
        continue;
      }
      // Recherche du bâtiment
      const building = await this.buildingRepository.findOne({ where: [{ name: data.building }] });
      if (!building) {
        results.errors.push({ row: i + 2, error: 'Bâtiment introuvable', data });
        continue;
      }
      // Recherche de la clé de répartition (optionnelle)
      let distributionKey: DistributionKey | null = null;
      if (data.distributionkey) {
        distributionKey = await this.distributionKeyRepository.findOne({ where: [{ name: data.distributionkey, building: building }] });
        if (!distributionKey) {
          results.errors.push({ row: i + 2, error: 'Clé de répartition introuvable', data });
          continue;
        }
        const expense = this.expenseRepository.create({
          description: data.description,
          amount: data.amount,
          date: data.date,
          type: data.type,
          building: building,
          distributionKey: distributionKey,
        });
        await this.expenseRepository.save(expense);
        results.imported.push({ row: i + 2, expense });
      }
      return results;
    }
   
  }
  
  async parsePdf(buffer: Buffer) {
    const data = await pdfParse(buffer);
    const lines = data.text.split('\n');
    const expenses = lines
      .map(line => {
        const match = line.match(/^(.*)\s+-\s+(\d+[\.,]\d{2})$/);
        if (match) {
          return {
            description: match[1].trim(),
            amount: parseFloat(match[2].replace(',', '.'))
          };
        }
        return null;
      })
      .filter(e => e);
    // Sauvegarde en base de données
    const saved = await this.expenseRepository.save(expenses);
    return { saved };
  }
}