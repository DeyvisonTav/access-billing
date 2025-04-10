import { Test, TestingModule } from '@nestjs/testing';
import { PdfBillsService } from './pdf-bills.service';
import { BillsRepository } from '../repositories/bills.repository';
import { LotsRepository } from '../repositories/lots.repository';
import { BusinessException } from '../../../core/exceptions/business-exception';
import { writeFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs/promises');
jest.mock('path');

// Mock do process.cwd()
Object.defineProperty(process, 'cwd', {
  value: () => '/mock/path',
});

describe('PdfBillsService', () => {
  let service: PdfBillsService;
  let billsRepository: BillsRepository;
  let lotsRepository: LotsRepository;
  let pdfHandler: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdfBillsService,
        {
          provide: BillsRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: LotsRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: 'PDF_HANDLER',
          useValue: {
            splitPdf: jest.fn(),
            createPdfReport: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PdfBillsService>(PdfBillsService);
    billsRepository = module.get<BillsRepository>(BillsRepository);
    lotsRepository = module.get<LotsRepository>(LotsRepository);
    pdfHandler = module.get('PDF_HANDLER');

    // Configurar o mock do join para retornar um caminho fixo
    (join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('splitPdfAndSave', () => {
    it('should split PDF and save pages successfully', async () => {
      const mockBuffer = Buffer.from('mock pdf content');
      const mockPages = [Buffer.from('page1'), Buffer.from('page2')];
      const mockBills = [
        {
          id: 1,
          nome_sacado: 'João Silva',
          id_lote: 1,
          valor: 100.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
          criado_em: new Date(),
        },
        {
          id: 2,
          nome_sacado: 'Maria Santos',
          id_lote: 1,
          valor: 200.75,
          linha_digitavel: '98765432109876543210987654321098765432109876543',
          ativo: true,
          criado_em: new Date(),
        }
      ];

      pdfHandler.splitPdf.mockResolvedValue(mockPages);
      (billsRepository.findAll as jest.Mock).mockResolvedValue(mockBills);
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await service.splitPdfAndSave(mockBuffer);

      expect(pdfHandler.splitPdf).toHaveBeenCalledWith(mockBuffer);
      expect(billsRepository.findAll).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalledTimes(2);
      expect(join).toHaveBeenCalledWith('/mock/path', 'uploads', '1.pdf');
      expect(join).toHaveBeenCalledWith('/mock/path', 'uploads', '2.pdf');
    });

    it('should throw error when number of pages does not match number of bills', async () => {
      const mockBuffer = Buffer.from('mock pdf content');
      const mockPages = [Buffer.from('page1')];
      const mockBills = [
        {
          id: 1,
          nome_sacado: 'João Silva',
          id_lote: 1,
          valor: 100.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
          criado_em: new Date(),
        },
        {
          id: 2,
          nome_sacado: 'Maria Silva',
          id_lote: 1,
          valor: 200.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
          criado_em: new Date(),
        },
      ];

      pdfHandler.splitPdf.mockResolvedValue(mockPages);
      (billsRepository.findAll as jest.Mock).mockResolvedValue(mockBills);

      await expect(service.splitPdfAndSave(mockBuffer)).rejects.toThrow(BusinessException);
    });
  });

  describe('generateReport', () => {
    it('should generate PDF report successfully', async () => {
      const mockFilters = { nome: 'João' };
      const mockBills = [
        {
          id: 1,
          nome_sacado: 'João Silva',
          id_lote: 1,
          valor: 100.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
          criado_em: new Date(),
        },
      ];
      const mockLots = [
        {
          id: 1,
          nome: '1001',
          ativo: true,
          criado_em: new Date(),
        },
      ];
      const mockPdfBuffer = Buffer.from('mock pdf content');

      (billsRepository.findAll as jest.Mock).mockResolvedValue(mockBills);
      (lotsRepository.findAll as jest.Mock).mockResolvedValue(mockLots);
      pdfHandler.createPdfReport.mockResolvedValue(mockPdfBuffer);

      const result = await service.generateReport(mockFilters);

      expect(result).toBe(mockPdfBuffer);
      expect(billsRepository.findAll).toHaveBeenCalledWith(mockFilters);
      expect(lotsRepository.findAll).toHaveBeenCalled();
      expect(pdfHandler.createPdfReport).toHaveBeenCalled();
    });

    it('should throw error when generating report fails', async () => {
      const mockFilters = { nome: 'João' };
      const mockBills = [
        {
          id: 1,
          nome_sacado: 'João Silva',
          id_lote: 1,
          valor: 100.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
          criado_em: new Date(),
        },
      ];
      const mockLots = [
        {
          id: 1,
          nome: '1001',
          ativo: true,
          criado_em: new Date(),
        },
      ];

      (billsRepository.findAll as jest.Mock).mockResolvedValue(mockBills);
      (lotsRepository.findAll as jest.Mock).mockResolvedValue(mockLots);
      pdfHandler.createPdfReport.mockRejectedValue(new Error('PDF generation failed'));

      await expect(service.generateReport(mockFilters)).rejects.toThrow(BusinessException);
    });
  });
}); 