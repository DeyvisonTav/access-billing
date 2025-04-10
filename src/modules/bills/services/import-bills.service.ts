import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { Lot } from '../entities/lot.entity';
import { ImportBillDto } from '../dtos/import-bill.dto';
import { parse } from 'fast-csv';
import { Readable } from 'stream';
import { LotMapper } from '../../../shared/utils/lot-mapper.util';
import { BusinessException } from '../../../core/exceptions/business-exception';

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
    const processedUnits = new Set<string>();
    const errors: string[] = [];
    const rowPromises: Promise<void>[] = [];

    return new Promise((resolve, reject) => {
      stream
        .pipe(parse({ headers: true, delimiter: ';', trim: true }))
        .on('error', (error) => {
          reject(error);
        })
        .on('data', (row: ImportBillDto) => {
          const promise = (async () => {
            try {
              // Limpa os campos da linha
              Object.keys(row).forEach(key => {
                if (typeof row[key] === 'string') {
                  row[key] = row[key].trim();
                }
              });

              if (processedUnits.has(row.unidade)) {
                errors.push(`Unidade ${row.unidade} duplicada no arquivo`);
                return;
              }
              processedUnits.add(row.unidade);

              const bill = await this.processRow(row);
              if (bill) {
                bills.push(bill);
              }
            } catch (error) {
              errors.push(`Erro ao processar linha da unidade ${row.unidade}: ${error.message}`);
            }
          })();
          rowPromises.push(promise);
        })
        .on('end', async () => {
          try {
            await Promise.all(rowPromises);
            
            if (errors.length > 0) {
              throw new BusinessException(
                `Erros encontrados durante a importação:\n${errors.join('\n')}`,
              );
            }

            if (bills.length === 0) {
              throw new BusinessException('Nenhum boleto válido encontrado para importação');
            }

            const savedBills = await this.billRepository.save(bills);
            resolve(savedBills);
          } catch (error) {
            if (error instanceof BusinessException) {
              reject(error);
            } else if (error.code === '23503') {
              reject(new BusinessException('Erro de integridade referencial. Verifique se todos os lotes existem.'));
            } else {
              reject(new BusinessException(`Erro ao salvar boletos: ${error.message}`));
            }
          }
        });
    });
  }

  private async processRow(row: ImportBillDto): Promise<Bill | null> {
    if (!/^\d{1,4}$/.test(row.unidade)) {
      throw new BusinessException(`Formato inválido para a unidade: ${row.unidade}`);
    }

    const lotName = LotMapper.formatUnitToLotName(row.unidade);
    
    let lot = await this.lotRepository.findOne({
      where: { nome: lotName },
    });

    // Se o lote não existir, cria automaticamente
    if (!lot) {
      lot = await this.lotRepository.save({
        nome: lotName,
        ativo: true,
      });
    }

    if (row.valor <= 0) {
      throw new BusinessException(`Valor inválido para a unidade ${row.unidade}: ${row.valor}`);
    }

    if (!/^\d+$/.test(row.linha_digitavel)) {
      throw new BusinessException(`Formato inválido para a linha digitável da unidade ${row.unidade}`);
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