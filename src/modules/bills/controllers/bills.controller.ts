import { Controller, Post, Get, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ImportBillsService } from '../services/import-bills.service';
import { ListBillsService } from '../services/list-bills.service';
import { PdfBillsService } from '../services/pdf-bills.service';
import { FilterBillsDto } from '../dtos/filter-bills.dto';

@ApiTags('boletos')
@Controller('bills')
export class BillsController {
  constructor(
    private readonly importBillsService: ImportBillsService,
    private readonly listBillsService: ListBillsService,
    private readonly pdfBillsService: PdfBillsService,
  ) {}

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Importar boletos via CSV',
    description: 'Importa boletos a partir de um arquivo CSV. O arquivo deve conter as colunas: nome_sacado, valor, linha_digitavel, id_lote'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo CSV contendo os boletos'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Boletos importados com sucesso',
    schema: {
      example: {
        message: 'Boletos importados com sucesso',
        count: 10
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Arquivo inválido ou formato incorreto',
        error: 'Bad Request'
      }
    }
  })
  async importBills(@UploadedFile() file: Express.Multer.File) {
    return this.importBillsService.importFromCsv(file);
  }

  @Post('import/pdf')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Importar boletos via PDF',
    description: 'Importa boletos a partir de um arquivo PDF. O PDF será dividido em boletos individuais e processado.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo PDF contendo os boletos'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'PDF processado com sucesso',
    schema: {
      example: {
        message: 'PDF processado com sucesso',
        count: 5
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Arquivo inválido',
    schema: {
      example: {
        statusCode: 400,
        message: 'Arquivo PDF inválido',
        error: 'Bad Request'
      }
    }
  })
  async importPdf(@UploadedFile() file: Express.Multer.File) {
    return this.pdfBillsService.splitPdfAndSave(file.buffer);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar boletos',
    description: 'Lista os boletos com base nos filtros fornecidos. Se o parâmetro relatorio=true for fornecido, retorna um PDF com o relatório.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de boletos retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: 1,
            nome_sacado: 'João Silva',
            valor: 1500.00,
            linha_digitavel: '34191.09008 00001.000000 00000.000000 1 00000000000000',
            id_lote: 1
          }
        ],
        total: 1
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Relatório PDF gerado com sucesso',
    schema: {
      example: {
        base64: 'JVBERi0xLjMK...'
      }
    }
  })
  @ApiQuery({ 
    name: 'nome_sacado', 
    required: false, 
    type: String,
    description: 'Nome do sacado para filtrar',
    example: 'João Silva'
  })
  @ApiQuery({ 
    name: 'valor_inicial', 
    required: false, 
    type: Number,
    description: 'Valor mínimo do boleto',
    example: 1000
  })
  @ApiQuery({ 
    name: 'valor_final', 
    required: false, 
    type: Number,
    description: 'Valor máximo do boleto',
    example: 2000
  })
  @ApiQuery({ 
    name: 'id_lote', 
    required: false, 
    type: Number,
    description: 'ID do lote para filtrar',
    example: 1
  })
  @ApiQuery({ 
    name: 'relatorio', 
    required: false, 
    type: Boolean,
    description: 'Indica se deve gerar um relatório em PDF',
    example: true
  })
  async findAll(@Query() filters: FilterBillsDto) {
    const bills = await this.listBillsService.findAll(filters);

    if (filters.relatorio) {
      const pdfBuffer = await this.pdfBillsService.generateReport(filters);
      return { base64: pdfBuffer.toString('base64') };
    }

    return bills;
  }
} 