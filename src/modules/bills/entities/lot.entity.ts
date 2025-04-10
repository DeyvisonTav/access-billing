import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Bill } from './bill.entity';

@Entity('lotes')
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criado_em: Date;

  @OneToMany(() => Bill, (bill) => bill.lote)
  boletos: Bill[];
} 