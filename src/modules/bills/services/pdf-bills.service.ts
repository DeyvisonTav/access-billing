import { Injectable, Inject } from '@nestjs/common';
import { BillsRepository } from '../repositories/bills.repository';
import { LotsRepository } from '../repositories/lots.repository';
import { BusinessException } from '../../../core/exceptions/business-exception';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class PdfBillsService {
  constructor(
    private readonly billsRepository: BillsRepository,
    private readonly lotsRepository: LotsRepository,
    @Inject('PDF_HANDLER') private readonly pdfHandler: any,
  ) {}

  async splitPdfAndSave(buffer: Buffer): Promise<void> {
    try {
      const pages = await this.pdfHandler.splitPdf(buffer);
      const bills = await this.billsRepository.findAll({});

      if (pages.length !== bills.length) {
        throw new BusinessException('Número de páginas não corresponde ao número de boletos');
      }

      for (let i = 0; i < pages.length; i++) {
        const bill = bills[i];
        const filePath = join(process.cwd(), 'uploads', `${bill.id}.pdf`);
        await writeFile(filePath, pages[i]);
      }
    } catch (error) {
      throw new BusinessException('Erro ao processar PDF');
    }
  }

  async generateReport(filters: any): Promise<Buffer> {
    try {
      const bills = await this.billsRepository.findAll(filters);
      const lots = await this.lotsRepository.findAll();
      const lotsMap = new Map(lots.map(lot => [lot.id, lot]));

      const billsWithLots = bills.map(bill => ({
        ...bill,
        lote: lotsMap.get(bill.id_lote)
      }));

      return this.pdfHandler.createPdfReport(billsWithLots);
    } catch (error) {
      throw new BusinessException('Erro ao gerar relatório');
    }
  }
} 