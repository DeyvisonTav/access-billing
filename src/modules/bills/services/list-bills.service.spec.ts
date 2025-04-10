import { Test, TestingModule } from '@nestjs/testing';
import { ListBillsService } from './list-bills.service';
import { BillsRepository } from '../repositories/bills.repository';
import { BusinessException } from '../../../core/exceptions/business-exception';
import { FilterBillsDto } from '../dtos/filter-bills.dto';

describe('ListBillsService', () => {
  let service: ListBillsService;
  let billsRepository: BillsRepository;

  const mockBillsRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListBillsService,
        {
          provide: BillsRepository,
          useValue: mockBillsRepository,
        },
      ],
    }).compile();

    service = module.get<ListBillsService>(ListBillsService);
    billsRepository = module.get<BillsRepository>(BillsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return bills successfully', async () => {
      const mockFilters: FilterBillsDto = {
        nome_sacado: 'João',
        valor_inicial: 100,
        valor_final: 200,
        id_lote: 1,
      };

      const mockBills = [
        {
          id: 1,
          nome_sacado: 'João Silva',
          id_lote: 1,
          valor: 150.50,
          linha_digitavel: '12345678901234567890123456789012345678901234567',
          ativo: true,
        },
      ];

      mockBillsRepository.findAll.mockResolvedValue(mockBills);

      const result = await service.findAll(mockFilters);

      expect(result).toBe(mockBills);
      expect(billsRepository.findAll).toHaveBeenCalledWith(mockFilters);
    });

    it('should throw error when repository fails', async () => {
      const mockFilters: FilterBillsDto = {
        nome_sacado: 'João',
      };

      mockBillsRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll(mockFilters)).rejects.toThrow(
        BusinessException,
      );
    });
  });
}); 