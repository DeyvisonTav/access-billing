import { IsNotEmpty, IsString, IsNumber, IsDecimal, Matches, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ImportBillDto {
  @IsNotEmpty({ message: 'O nome do sacado é obrigatório' })
  @IsString({ message: 'O nome do sacado deve ser uma string' })
  nome: string;

  @IsNotEmpty({ message: 'A unidade é obrigatória' })
  @IsString({ message: 'A unidade deve ser uma string' })
  @Matches(/^\d{1,4}$/, { message: 'A unidade deve conter de 1 a 4 dígitos' })
  unidade: string;

  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0.01, { message: 'O valor deve ser maior que zero' })
  valor: number;

  @IsNotEmpty({ message: 'A linha digitável é obrigatória' })
  @IsString({ message: 'A linha digitável deve ser uma string' })
  @Matches(/^\d{47}$/, { message: 'A linha digitável deve conter exatamente 47 dígitos' })
  linha_digitavel: string;
} 