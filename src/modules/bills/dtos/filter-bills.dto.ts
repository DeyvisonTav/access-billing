import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterBillsDto {
  @ApiProperty({ required: false, description: 'Nome do sacado' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ required: false, description: 'Valor inicial do boleto', type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  valor_inicial?: number;

  @ApiProperty({ required: false, description: 'Valor final do boleto', type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  valor_final?: number;

  @ApiProperty({ required: false, description: 'ID do lote', type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id_lote?: number;

  @ApiProperty({ required: false, description: 'Gerar relatório em PDF', type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  relatorio?: boolean;
} 