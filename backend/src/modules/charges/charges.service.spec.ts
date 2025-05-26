import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargesService } from './charges.service';
import { Charge } from './entities/charge.entity';
import { Building } from '../buildings/entities/building.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { ChargeType } from './enums/charge-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('ChargesService', () => {
  let service: ChargesService;
  let chargeRepository: Repository<Charge>;
  let buildingRepository: Repository<Building>;
  let apartmentRepository: Repository<Apartment>;

  const mockCharge = {
    id: '1',
    description: 'Test Charge',
    amount: 100,
    date: new Date(),
    type: ChargeType.SURFACE,
    building: { id: '1' },
  };

  const mockBuilding = {
    id: '1',
    name: 'Test Building',
    apartments: [
      { id: '1', surface: 50 },
      { id: '2', surface: 75 },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        {
          provide: getRepositoryToken(Charge),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Building),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Apartment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ChargesService>(ChargesService);
    chargeRepository = module.get<Repository<Charge>>(getRepositoryToken(Charge));
    buildingRepository = module.get<Repository<Building>>(getRepositoryToken(Building));
    apartmentRepository = module.get<Repository<Apartment>>(getRepositoryToken(Apartment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a charge', async () => {
      const createChargeDto = {
        description: 'Test Charge',
        amount: 100,
        date: new Date(),
        type: ChargeType.SURFACE,
        buildingId: '1',
      };

      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(mockBuilding as any);
      jest.spyOn(chargeRepository, 'create').mockReturnValue(mockCharge as any);
      jest.spyOn(chargeRepository, 'save').mockResolvedValue(mockCharge as any);

      const result = await service.create(createChargeDto);
      expect(result).toEqual(mockCharge);
    });

    it('should throw NotFoundException if building not found', async () => {
      const createChargeDto = {
        description: 'Test Charge',
        amount: 100,
        date: new Date(),
        type: ChargeType.SURFACE,
        buildingId: '1',
      };

      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createChargeDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of charges', async () => {
      const charges = [mockCharge];
      jest.spyOn(chargeRepository, 'find').mockResolvedValue(charges as any);

      const result = await service.findAll();
      expect(result).toEqual(charges);
    });

    it('should filter charges by buildingId', async () => {
      const charges = [mockCharge];
      jest.spyOn(chargeRepository, 'find').mockResolvedValue(charges as any);

      const result = await service.findAll('1');
      expect(result).toEqual(charges);
    });
  });

  describe('calculateCharges', () => {
    it('should calculate charges for a building', async () => {
      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(mockBuilding as any);
      jest.spyOn(chargeRepository, 'find').mockResolvedValue([mockCharge] as any);

      const result = await service.calculateCharges('1', 2024, 3);
      expect(result).toHaveProperty('buildingId');
      expect(result).toHaveProperty('period');
      expect(result).toHaveProperty('chargesByApartment');
    });

    it('should throw NotFoundException if building not found', async () => {
      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.calculateCharges('1', 2024, 3)).rejects.toThrow(NotFoundException);
    });
  });
}); 