import { IsNotEmpty, IsString, IsNumber, IsDecimal } from 'class-validator';

export class ImportBillDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  unidade: string;

  @IsNotEmpty()
  @IsNumber()
  valor: number;

  @IsNotEmpty()
  @IsString()
  linha_digitavel: string;
} 