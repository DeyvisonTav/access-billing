import { Test, TestingModule } from '@nestjs/testing';
import { PdfBillsService } from './pdf-bills.service';
import { BillsRepository } from '../repositories/bills.repository';
import { LotsRepository } from '../repositories/lots.repository';
import { BusinessException } from '../../../core/exceptions/business-exception';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { FilterBillsDto } from '../dtos/filter-bills.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from '../entities/bill.entity';

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
          provide: getRepositoryToken(Bill),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
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
    (join as jest.Mock).mockImplementation((...args) => {
      if (args.length === 3) {
        return `${args[0]}/${args[1]}/${args[2]}`;
      }
      return args.join('/');
    });

    // Limpar chamadas anteriores do mock
    (join as jest.Mock).mockClear();
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
      (service['billRepository'].find as jest.Mock).mockResolvedValue(mockBills);
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      await service.splitPdfAndSave(mockBuffer);

      expect(pdfHandler.splitPdf).toHaveBeenCalledWith(mockBuffer);
      expect(service['billRepository'].find).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalledTimes(2);
      
      // Verificar as chamadas do join
      const joinCalls = (join as jest.Mock).mock.calls;
      expect(joinCalls.length).toBe(3);
      expect(joinCalls[0]).toEqual(['/mock/path', 'uploads']);
      expect(joinCalls[1]).toEqual(['/mock/path/uploads', '1.pdf']);
      expect(joinCalls[2]).toEqual(['/mock/path/uploads', '2.pdf']);
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
      (service['billRepository'].find as jest.Mock).mockResolvedValue(mockBills);

      await expect(service.splitPdfAndSave(mockBuffer)).rejects.toThrow(BusinessException);
    });
  });

  describe('generateReport', () => {
    it('should generate PDF report successfully', async () => {
      const mockFilters: FilterBillsDto = { nome_sacado: 'João' };
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
      const mockPdfBuffer = Buffer.from('mock pdf content');

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBills),
      };

      (service['billRepository'].createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      pdfHandler.createPdfReport.mockResolvedValue(mockPdfBuffer);

      const result = await service.generateReport(mockFilters);

      expect(result).toBe(mockPdfBuffer);
      expect(service['billRepository'].createQueryBuilder).toHaveBeenCalled();
      expect(pdfHandler.createPdfReport).toHaveBeenCalledWith(mockBills);
    });

    it('should throw error when generating report fails', async () => {
      const mockFilters: FilterBillsDto = { nome_sacado: 'João' };
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

      (service['billRepository'].createQueryBuilder as jest.Mock)().getMany.mockResolvedValue(mockBills);
      pdfHandler.createPdfReport.mockRejectedValue(new BusinessException('PDF generation failed'));

      await expect(service.generateReport(mockFilters)).rejects.toThrow(BusinessException);
    });
  });
}); 