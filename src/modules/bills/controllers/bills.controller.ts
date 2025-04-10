import { Controller, Post, Get, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportBillsService } from '../services/import-bills.service';
import { ListBillsService } from '../services/list-bills.service';
import { PdfBillsService } from '../services/pdf-bills.service';
import { FilterBillsDto } from '../dtos/filter-bills.dto';

@Controller('bills')
export class BillsController {
  constructor(
    private readonly importBillsService: ImportBillsService,
    private readonly listBillsService: ListBillsService,
    private readonly pdfBillsService: PdfBillsService,
  ) {}

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importBills(@UploadedFile() file: Express.Multer.File) {
    return this.importBillsService.importFromCsv(file);
  }

  @Post('import/pdf')
  @UseInterceptors(FileInterceptor('file'))
  async importPdf(@UploadedFile() file: Express.Multer.File) {
    return this.pdfBillsService.splitPdfAndSave(file.buffer);
  }

  @Get()
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