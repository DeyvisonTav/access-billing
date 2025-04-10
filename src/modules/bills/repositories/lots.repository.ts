import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot.entity';

@Injectable()
export class LotsRepository {
  constructor(
    @InjectRepository(Lot)
    private readonly repository: Repository<Lot>,
  ) {}

  async findByNome(nome: string): Promise<Lot | null> {
    return this.repository.findOne({ where: { nome } });
  }

  async findAll(): Promise<Lot[]> {
    return this.repository.find();
  }
} 