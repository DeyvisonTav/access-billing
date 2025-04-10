import { Test, TestingModule } from '@nestjs/testing';
import { ImportBillsService } from './import-bills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { Lot } from '../entities/lot.entity';
import { BusinessException } from '../../../core/exceptions/business-exception';

describe('ImportBillsService', () => {
  let service: ImportBillsService;
  let billRepository: Repository<Bill>;
  let lotRepository: Repository<Lot>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportBillsService,
        {
          provide: getRepositoryToken(Bill),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Lot),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImportBillsService>(ImportBillsService);
    billRepository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
    lotRepository = module.get<Repository<Lot>>(getRepositoryToken(Lot));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importFromCsv', () => {
    it('should import bills from CSV successfully', async () => {
      const mockFile = {
        buffer: Buffer.from(
          'nome;unidade;valor;linha_digitavel\n' +
            'João Silva;1001;100,50;12345678901234567890123456789012345678901234567',
        ),
      };

      const mockLot: Lot = {
        id: 1,
        nome: '1001',
        ativo: true,
        criado_em: new Date(),
      };

      const mockBill: Bill = {
        id: 1,
        nome_sacado: 'João Silva',
        id_lote: 1,
        valor: 100.50,
        linha_digitavel: '12345678901234567890123456789012345678901234567',
        ativo: true,
        criado_em: new Date(),
      };

      (lotRepository.findOne as jest.Mock).mockResolvedValue(mockLot);
      (billRepository.save as jest.Mock).mockResolvedValue([mockBill]);

      const result = await service.importFromCsv(mockFile as any);

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(lotRepository.findOne).toHaveBeenCalled();
      expect(billRepository.save).toHaveBeenCalled();
    }, 10000);

    it('should throw error for invalid unit format', async () => {
      const mockFile = {
        buffer: Buffer.from(
          'nome;unidade;valor;linha_digitavel\n' +
            'João Silva;ABC;100,50;12345678901234567890123456789012345678901234567',
        ),
      };

      await expect(service.importFromCsv(mockFile as any)).rejects.toThrow(
        BusinessException,
      );
    }, 10000);

    it('should throw error for non-existent lot', async () => {
      const mockFile = {
        buffer: Buffer.from(
          'nome;unidade;valor;linha_digitavel\n' +
            'João Silva;1001;100,50;12345678901234567890123456789012345678901234567',
        ),
      };

      (lotRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.importFromCsv(mockFile as any)).rejects.toThrow(
        BusinessException,
      );
    }, 10000);

    it('should throw error for invalid line digit format', async () => {
      const mockFile = {
        buffer: Buffer.from(
          'nome;unidade;valor;linha_digitavel\n' +
            'João Silva;1001;100,50;1234567890123456789012345678901234567890123456A',
        ),
      };

      const mockLot: Lot = {
        id: 1,
        nome: '1001',
        ativo: true,
        criado_em: new Date(),
      };

      (lotRepository.findOne as jest.Mock).mockResolvedValue(mockLot);

      await expect(service.importFromCsv(mockFile as any)).rejects.toThrow(
        BusinessException,
      );
    }, 10000);

    it('should throw error for invalid value', async () => {
      const mockFile = {
        buffer: Buffer.from(
          'nome;unidade;valor;linha_digitavel\n' +
            'João Silva;1001;0;12345678901234567890123456789012345678901234567',
        ),
      };

      const mockLot: Lot = {
        id: 1,
        nome: '1001',
        ativo: true,
        criado_em: new Date(),
      };

      (lotRepository.findOne as jest.Mock).mockResolvedValue(mockLot);

      await expect(service.importFromCsv(mockFile as any)).rejects.toThrow(
        BusinessException,
      );
    }, 10000);
  });
}); 