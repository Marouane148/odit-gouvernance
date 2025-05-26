import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsService } from './buildings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Building } from '../../entities/building.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BuildingsService', () => {
  let service: BuildingsService;
  let repository: Repository<Building>;

  const mockBuildingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingsService,
        {
          provide: getRepositoryToken(Building),
          useValue: mockBuildingRepository,
        },
      ],
    }).compile();

    service = module.get<BuildingsService>(BuildingsService);
    repository = module.get<Repository<Building>>(getRepositoryToken(Building));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new building', async () => {
      const buildingDto = { 
          name: 'Test Building', 
          address: '123 Test St',
          managementStartDate: new Date() // Ajout du champ requis
      };
      const building = { id: '1', ...buildingDto };

      mockBuildingRepository.create.mockReturnValue(building);
      mockBuildingRepository.save.mockResolvedValue(building);

      const result = await service.create(buildingDto);
      expect(result).toEqual(building);
    });
  });

  describe('findAll', () => {
    it('should return an array of buildings', async () => {
      const buildings = [
        { id: '1', name: 'Building 1' },
        { id: '2', name: 'Building 2' },
      ];

      mockBuildingRepository.find.mockResolvedValue(buildings);

      const result = await service.findAll();
      expect(result).toEqual(buildings);
    });
  });

  describe('findOne', () => {
    it('should return a building by id', async () => {
      const building = { id: '1', name: 'Building 1' };

      mockBuildingRepository.findOne.mockResolvedValue(building);

      const result = await service.findOne('1');
      expect(result).toEqual(building);
    });

    it('should throw NotFoundException when building is not found', async () => {
      mockBuildingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a building', async () => {
      const buildingDto = { 
          name: 'Updated Building',
          managementStartDate: new Date() // Ajout du champ requis
      };
      const building = { id: '1', name: 'Updated Building', managementStartDate: new Date() };

      mockBuildingRepository.findOne.mockResolvedValue(building);
      mockBuildingRepository.save.mockResolvedValue(building);

      const result = await service.update('1', buildingDto);
      expect(result).toEqual(building);
    });

    it('should throw NotFoundException when building to update is not found', async () => {
      mockBuildingRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a building', async () => {
      const building = { id: '1', name: 'Test Building' };
      mockBuildingRepository.findOne.mockResolvedValue(building);
      mockBuildingRepository.remove.mockResolvedValue(building);

      await service.remove('1');
      expect(mockBuildingRepository.remove).toHaveBeenCalledWith(building);
    });

    it('should throw NotFoundException when building to remove is not found', async () => {
      mockBuildingRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});