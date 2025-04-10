import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';

@Injectable()
export class BillsRepository {
  constructor(
    @InjectRepository(Bill)
    private readonly repository: Repository<Bill>,
  ) {}

  async findAll(filters: any): Promise<Bill[]> {
    const query = this.repository.createQueryBuilder('bill');

    if (filters.nome) {
      query.andWhere('bill.nome_sacado ILIKE :nome', { nome: `%${filters.nome}%` });
    }

    if (filters.valor_inicial) {
      query.andWhere('bill.valor >= :valor_inicial', { valor_inicial: filters.valor_inicial });
    }

    if (filters.valor_final) {
      query.andWhere('bill.valor <= :valor_final', { valor_final: filters.valor_final });
    }

    if (filters.id_lote) {
      query.andWhere('bill.id_lote = :id_lote', { id_lote: filters.id_lote });
    }

    return query.getMany();
  }

  async create(bill: Bill): Promise<Bill> {
    return this.repository.save(bill);
  }

  async createMany(bills: Bill[]): Promise<Bill[]> {
    return this.repository.save(bills);
  }
} 