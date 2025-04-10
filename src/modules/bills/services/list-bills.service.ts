import { Injectable } from '@nestjs/common';
import { BillsRepository } from '../repositories/bills.repository';
import { FilterBillsDto } from '../dtos/filter-bills.dto';
import { BusinessException } from '../../../core/exceptions/business-exception';

@Injectable()
export class ListBillsService {
  constructor(private readonly billsRepository: BillsRepository) {}

  async findAll(filters: FilterBillsDto) {
    try {
      const bills = await this.billsRepository.findAll(filters);
      return bills;
    } catch (error) {
      throw new BusinessException('Erro ao listar boletos');
    }
  }
} 