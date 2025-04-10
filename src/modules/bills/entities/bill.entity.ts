import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('boletos')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome_sacado', length: 255 })
  nome_sacado: string;

  @Column({ name: 'id_lote' })
  id_lote: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column({ name: 'linha_digitavel', length: 255 })
  linha_digitavel: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;
} 