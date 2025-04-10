import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { FilterBillsDto } from '../dtos/filter-bills.dto';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { BusinessException } from '../../../core/exceptions/business-exception';

@Injectable()
export class PdfBillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @Inject('PDF_HANDLER')
    private readonly pdfHandler: any,
  ) {}

  async splitPdfAndSave(buffer: Buffer): Promise<void> {
    const bills = await this.billRepository.find({ order: { id: 'ASC' } });
    const pages = await this.pdfHandler.splitPdf(buffer);

    if (pages.length !== bills.length) {
      throw new BusinessException(
        `Número de páginas (${pages.length}) não corresponde ao número de boletos (${bills.length})`,
      );
    }

    const pdfDir = join(process.cwd(), 'uploads');
    await mkdir(pdfDir, { recursive: true });

    for (let i = 0; i < pages.length; i++) {
      const bill = bills[i];
      const pdfPath = join(pdfDir, `${bill.id}.pdf`);
      await writeFile(pdfPath, pages[i]);
    }
  }

  async generateReport(filters: FilterBillsDto): Promise<Buffer> {
    const query = this.billRepository.createQueryBuilder('bill');

    if (filters.nome_sacado) {
      query.andWhere('bill.nome_sacado ILIKE :nome_sacado', {
        nome_sacado: `%${filters.nome_sacado}%`,
      });
    }

    if (filters.id_lote) {
      query.andWhere('bill.id_lote = :id_lote', { id_lote: filters.id_lote });
    }

    if (filters.valor_inicial) {
      query.andWhere('bill.valor >= :valor_inicial', {
        valor_inicial: filters.valor_inicial,
      });
    }

    if (filters.valor_final) {
      query.andWhere('bill.valor <= :valor_final', {
        valor_final: filters.valor_final,
      });
    }

    const bills = await query.getMany();
    return this.pdfHandler.createPdfReport(bills);
  }

  async createTestPdf(): Promise<Buffer> {
    return this.pdfHandler.createTestPdf();
  }
} 