import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './core/database/database.module';
import { BillsModule } from './modules/bills/bills.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    BillsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
