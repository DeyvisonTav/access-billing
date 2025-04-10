import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportBillsService } from '../services/import-bills.service';

@Controller('bills')
export class BillsController {
  constructor(private readonly importBillsService: ImportBillsService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importBills(@UploadedFile() file: Express.Multer.File) {
    return this.importBillsService.importFromCsv(file);
  }
} 