import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionKeysService } from './distribution-keys.service';
import { DistributionKey } from './entities/distribution-key.entity';
import { Building } from '../buildings/entities/building.entity';
import { DistributionKeyType } from './entities/distribution-key.entity';
import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../users/enums/user-role.enum';

describe('DistributionKeysService', () => {
  let service: DistributionKeysService;
  let distributionKeyRepository: Repository<DistributionKey>;
  let buildingRepository: Repository<Building>;

  const mockBuilding = {
    id: '1',
    name: 'Test Building',
    address: '123 Test St',
    city: 'Test City',
    postalCode: '12345',
    totalSurface: 1000,
    numberOfApartments: 10,
  };

  const mockDistributionKey = {
    id: '1',
    name: 'Test Key',
    type: DistributionKeyType.SURFACE,
    value: 100,
    description: 'Test Description',
    building: mockBuilding,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributionKeysService,
        {
          provide: getRepositoryToken(DistributionKey),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Building),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DistributionKeysService>(DistributionKeysService);
    distributionKeyRepository = module.get<Repository<DistributionKey>>(getRepositoryToken(DistributionKey));
    buildingRepository = module.get<Repository<Building>>(getRepositoryToken(Building));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a distribution key', async () => {
      const createDto = {
        name: 'Test Key',
        type: DistributionKeyType.SURFACE,
        value: 100,
        description: 'Test Description',
        buildingId: '1',
      };

      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(mockBuilding as any);
      jest.spyOn(distributionKeyRepository, 'create').mockReturnValue(mockDistributionKey as any);
      jest.spyOn(distributionKeyRepository, 'save').mockResolvedValue(mockDistributionKey as any);

      const result = await service.create(createDto);
      expect(result).toEqual({
        id: mockDistributionKey.id,
        name: mockDistributionKey.name,
        type: mockDistributionKey.type,
        value: mockDistributionKey.value,
        description: mockDistributionKey.description,
        buildingId: mockBuilding.id,
        createdAt: mockDistributionKey.createdAt,
        updatedAt: mockDistributionKey.updatedAt,
      });
    });

    it('should throw NotFoundException if building not found', async () => {
      const createDto = {
        name: 'Test Key',
        type: DistributionKeyType.SURFACE,
        value: 100,
        description: 'Test Description',
        buildingId: '1',
      };

      jest.spyOn(buildingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of distribution keys', async () => {
      const keys = [mockDistributionKey];
      jest.spyOn(distributionKeyRepository, 'find').mockResolvedValue(keys as any);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockDistributionKey.id,
        name: mockDistributionKey.name,
        type: mockDistributionKey.type,
        value: mockDistributionKey.value,
        description: mockDistributionKey.description,
        buildingId: mockBuilding.id,
        createdAt: mockDistributionKey.createdAt,
        updatedAt: mockDistributionKey.updatedAt,
      });
    });

    it('should filter keys by buildingId', async () => {
      const keys = [mockDistributionKey];
      jest.spyOn(distributionKeyRepository, 'find').mockResolvedValue(keys as any);

      const result = await service.findAll('1');
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a distribution key', async () => {
      jest.spyOn(distributionKeyRepository, 'findOne').mockResolvedValue(mockDistributionKey as any);

      const result = await service.findOne('1');
      expect(result).toEqual({
        id: mockDistributionKey.id,
        name: mockDistributionKey.name,
        type: mockDistributionKey.type,
        value: mockDistributionKey.value,
        description: mockDistributionKey.description,
        buildingId: mockBuilding.id,
        createdAt: mockDistributionKey.createdAt,
        updatedAt: mockDistributionKey.updatedAt,
      });
    });

    it('should throw NotFoundException if key not found', async () => {
      jest.spyOn(distributionKeyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a distribution key', async () => {
      const updateDto = {
        name: 'Updated Key',
        value: 200,
      };

      jest.spyOn(distributionKeyRepository, 'findOne').mockResolvedValue(mockDistributionKey as any);
      jest.spyOn(distributionKeyRepository, 'save').mockResolvedValue({
        ...mockDistributionKey,
        ...updateDto,
      } as any);

      const result = await service.update('1', updateDto);
      expect(result.name).toBe(updateDto.name);
      expect(result.value).toBe(updateDto.value);
    });

    it('should throw NotFoundException if key not found', async () => {
      jest.spyOn(distributionKeyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Key' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a distribution key', async () => {
      jest.spyOn(distributionKeyRepository, 'findOne').mockResolvedValue(mockDistributionKey as any);
      jest.spyOn(distributionKeyRepository, 'remove').mockResolvedValue(mockDistributionKey as any);

      await expect(service.remove('1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if key not found', async () => {
      jest.spyOn(distributionKeyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
}); 