import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lot } from './lot.entity';

@Entity('boletos')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome_sacado: string;

  @Column({ name: 'id_lote' })
  idLote: number;

  @ManyToOne(() => Lot, (lot) => lot.boletos)
  @JoinColumn({ name: 'id_lote' })
  lote: Lot;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column({ length: 255 })
  linha_digitavel: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criado_em: Date;
} 