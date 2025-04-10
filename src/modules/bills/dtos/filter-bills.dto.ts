import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterBillsDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  valor_inicial?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  valor_final?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id_lote?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  relatorio?: boolean;
} 