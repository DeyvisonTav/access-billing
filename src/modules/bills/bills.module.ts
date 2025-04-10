import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Lot } from './entities/lot.entity';
import { BillsController } from './controllers/bills.controller';
import { ImportBillsService } from './services/import-bills.service';
import { ListBillsService } from './services/list-bills.service';
import { PdfBillsService } from './services/pdf-bills.service';
import { BillsRepository } from './repositories/bills.repository';
import { LotsRepository } from './repositories/lots.repository';
import { FileUploadProvider } from '../../shared/providers/file-upload.provider';
import { PdfHandlerProvider } from '../../shared/providers/pdf-handler.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, Lot]),
  ],
  controllers: [BillsController],
  providers: [
    ImportBillsService,
    ListBillsService,
    PdfBillsService,
    BillsRepository,
    LotsRepository,
    FileUploadProvider,
    PdfHandlerProvider,
    {
      provide: 'PDF_HANDLER',
      useExisting: PdfHandlerProvider,
    },
  ],
  exports: [ImportBillsService, ListBillsService, PdfBillsService],
})
export class BillsModule {} 