import { IsNotEmpty, IsString, IsNumber, IsDecimal, Matches, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ImportBillDto {
  @ApiProperty({ description: 'Nome do sacado' })
  @IsNotEmpty({ message: 'O nome do sacado é obrigatório' })
  @IsString({ message: 'O nome do sacado deve ser uma string' })
  nome: string;

  @ApiProperty({ description: 'Número da unidade (1 a 4 dígitos)' })
  @IsNotEmpty({ message: 'A unidade é obrigatória' })
  @IsString({ message: 'A unidade deve ser uma string' })
  @Matches(/^\d{1,4}$/, { message: 'A unidade deve conter de 1 a 4 dígitos' })
  unidade: string;

  @ApiProperty({ description: 'Valor do boleto', type: Number })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return Number(value.replace(',', '.'));
    }
    return Number(value);
  })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0.01, { message: 'O valor deve ser maior que zero' })
  valor: number;

  @ApiProperty({ description: 'Linha digitável do boleto' })
  @IsNotEmpty({ message: 'A linha digitável é obrigatória' })
  @IsString({ message: 'A linha digitável deve ser uma string' })
  @Matches(/^\d+$/, { message: 'A linha digitável deve conter apenas dígitos' })
  linha_digitavel: string;
} 