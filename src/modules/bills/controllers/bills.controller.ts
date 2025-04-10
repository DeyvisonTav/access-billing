import { Controller, Post, Get, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiQuery } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Importar boletos via CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Boletos importados com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async importBills(@UploadedFile() file: Express.Multer.File) {
    return this.importBillsService.importFromCsv(file);
  }

  @Post('import/pdf')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Importar boletos via PDF' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'PDF processado com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  async importPdf(@UploadedFile() file: Express.Multer.File) {
    return this.pdfBillsService.splitPdfAndSave(file.buffer);
  }

  @Get()
  @ApiOperation({ summary: 'Listar boletos' })
  @ApiResponse({ status: 200, description: 'Lista de boletos retornada com sucesso' })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'valor_inicial', required: false, type: Number })
  @ApiQuery({ name: 'valor_final', required: false, type: Number })
  @ApiQuery({ name: 'id_lote', required: false, type: Number })
  @ApiQuery({ name: 'relatorio', required: false, type: Boolean })
  async findAll(@Query() filters: FilterBillsDto) {
    const bills = await this.listBillsService.findAll(filters);

    if (filters.relatorio) {
      const pdfBuffer = await this.pdfBillsService.generateReport(filters);
      return {
        base64: pdfBuffer.toString('base64'),
      };
    }

    return bills;
  }
} 