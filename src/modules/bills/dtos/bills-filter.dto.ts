import { IsOptional, IsString, IsNumber } from 'class-validator';

export class BillsFilter {
  @IsOptional()
  @IsString()
  nome_sacado?: string;

  @IsOptional()
  @IsNumber()
  id_lote?: number;

  @IsOptional()
  @IsNumber()
  valor_inicial?: number;

  @IsOptional()
  @IsNumber()
  valor_final?: number;
} 