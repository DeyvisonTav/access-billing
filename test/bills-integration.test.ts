import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../src/modules/bills/entities/bill.entity';
import { Lot } from '../src/modules/bills/entities/lot.entity';
import { join } from 'path';
import { readFileSync } from 'fs';

describe('Bills Integration Tests', () => {
  let app: INestApplication;
  let billRepository: Repository<Bill>;
  let lotRepository: Repository<Lot>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    billRepository = moduleFixture.get<Repository<Bill>>(getRepositoryToken(Bill));
    lotRepository = moduleFixture.get<Repository<Lot>>(getRepositoryToken(Lot));
  });

  beforeEach(async () => {
    await billRepository.delete({});
    await lotRepository.delete({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Import Bills Flow', () => {
    it('should import bills from CSV successfully', async () => {
      const lot = await lotRepository.save({
        nome: '1001',
        ativo: true,
      });

      const csvPath = join(__dirname, 'fixtures', 'bills.csv');
      const csvContent = readFileSync(csvPath);

      await request(app.getHttpServer())
        .post('/bills/import/csv')
        .attach('file', csvContent, 'bills.csv')
        .expect(201);

      const bills = await billRepository.find();
      expect(bills.length).toBe(2);
      expect(bills[0].nome_sacado).toBe('João Silva');
      expect(bills[0].id_lote).toBe(lot.id);
      expect(bills[0].valor).toBe(100.50);
    });

    it('should import PDFs successfully', async () => {
        const lot = await lotRepository.save({
        nome: '1001',
        ativo: true,
      });

      await billRepository.save({
        nome_sacado: 'João Silva',
        id_lote: lot.id,
        valor: 100.50,
        linha_digitavel: '12345678901234567890123456789012345678901234567',
        ativo: true,
      });

      // Ler arquivo PDF de teste
      const pdfPath = join(__dirname, 'fixtures', 'bills.pdf');
      const pdfContent = readFileSync(pdfPath);

      // Fazer upload do PDF
      await request(app.getHttpServer())
        .post('/bills/import/pdf')
        .attach('file', pdfContent, 'bills.pdf')
        .expect(201);

      const savedPdfPath = join(process.cwd(), 'uploads', '1.pdf');
      const savedPdfContent = readFileSync(savedPdfPath);
      expect(savedPdfContent).toBeDefined();
    });

    it('should list bills with filters', async () => {
      const lot = await lotRepository.save({
        nome: '1001',
        ativo: true,
      });

      await billRepository.save([
        {
          nome_sacado: 'João Silva',
          id_lote: lot.id,
          valor: 100.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
        },
        {
          nome_sacado: 'Maria Santos',
          id_lote: lot.id,
          valor: 200.75,
          linha_digitavel: '98765432109876543210987654321098765432109876543',
          ativo: true,
        },
      ]);

      const response = await request(app.getHttpServer())
        .get('/bills')
        .query({ nome: 'João' })
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].nome_sacado).toBe('João Silva');
    });

    it('should generate PDF report', async () => {
      const lot = await lotRepository.save({
        nome: '1001',
        ativo: true,
      });

      await billRepository.save({
        nome_sacado: 'João Silva',
        id_lote: lot.id,
        valor: 100.50,
        linha_digitavel: '12345678901234567890123456789012345678901234567',
        ativo: true,
      });

      const response = await request(app.getHttpServer())
        .get('/bills')
        .query({ relatorio: true })
        .expect(200);

      expect(response.body.base64).toBeDefined();
      expect(response.body.base64.length).toBeGreaterThan(0);
    });
  });
}); 