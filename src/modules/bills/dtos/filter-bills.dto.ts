import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterBillsDto {
  @ApiProperty({
    required: false,
    description: 'Nome do sacado para filtrar os boletos',
    example: 'João Silva',
    type: String
  })
  @IsOptional()
  @IsString()
  nome_sacado?: string;

  @ApiProperty({
    required: false,
    description: 'Valor mínimo do boleto para filtrar',
    example: 1000,
    type: Number,
    minimum: 0
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  valor_inicial?: number;

  @ApiProperty({
    required: false,
    description: 'Valor máximo do boleto para filtrar',
    example: 2000,
    type: Number,
    minimum: 0
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  valor_final?: number;

  @ApiProperty({
    required: false,
    description: 'ID do lote para filtrar os boletos',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  id_lote?: number;

  @ApiProperty({
    required: false,
    description: 'Indica se deve gerar um relatório em PDF',
    example: true,
    type: Boolean,
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  relatorio?: boolean;
} 