import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { Lot } from '../entities/lot.entity';
import { ImportBillDto } from '../dtos/import-bill.dto';
import { parse } from 'fast-csv';
import { Readable } from 'stream';
import { LotMapper } from '../../../shared/utils/lot-mapper.util';

@Injectable()
export class ImportBillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async importFromCsv(file: Express.Multer.File): Promise<Bill[]> {
    const bills: Bill[] = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(parse({ headers: true, delimiter: ';' }))
        .on('error', (error) => reject(error))
        .on('data', async (row: ImportBillDto) => {
          const bill = await this.processRow(row);
          if (bill) {
            bills.push(bill);
          }
        })
        .on('end', async () => {
          const savedBills = await this.billRepository.save(bills);
          resolve(savedBills);
        });
    });
  }

  private async processRow(row: ImportBillDto): Promise<Bill | null> {
    const lotName = LotMapper.formatUnitToLotName(row.unidade);
    const lot = await this.lotRepository.findOne({
      where: { nome: lotName },
    });

    if (!lot) {
      console.warn(`Lote não encontrado para a unidade: ${row.unidade}`);
      return null;
    }

    const bill = new Bill();
    bill.nome_sacado = row.nome;
    bill.id_lote = lot.id;
    bill.valor = row.valor;
    bill.linha_digitavel = row.linha_digitavel;
    bill.ativo = true;

    return bill;
  }
} 