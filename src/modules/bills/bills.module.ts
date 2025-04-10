import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Lot } from './entities/lot.entity';
import { BillsController } from './controllers/bills.controller';
import { ImportBillsService } from './services/import-bills.service';
import { FileUploadProvider } from '../../shared/providers/file-upload.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, Lot]),
  ],
  controllers: [BillsController],
  providers: [ImportBillsService, FileUploadProvider],
  exports: [ImportBillsService],
})
export class BillsModule {} 