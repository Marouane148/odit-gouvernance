import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';

describe('BuildingsController', () => {
  let controller: BuildingsController;
  let service: BuildingsService;

  const mockBuildingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingsController],
      providers: [
        {
          provide: BuildingsService,
          useValue: mockBuildingsService,
        },
      ],
    }).compile();

    controller = module.get<BuildingsController>(BuildingsController);
    service = module.get<BuildingsService>(BuildingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a building', async () => {
      const buildingDto = { name: 'Test Building', address: '123 Test St' };
      const building = { id: '1', ...buildingDto };

      mockBuildingsService.create.mockResolvedValue(building);

      const result = await controller.create({
        name: 'Test Building',
        address: '123 Test St',
        managementStartDate: new Date()
      });
      expect(result).toEqual(building);
    });
  });

  describe('findAll', () => {
    it('should return an array of buildings', async () => {
      const buildings = [
        { id: '1', name: 'Building 1' },
        { id: '2', name: 'Building 2' },
      ];

      mockBuildingsService.findAll.mockResolvedValue(buildings);

      const result = await controller.findAll();
      expect(result).toEqual(buildings);
    });
  });

  describe('findOne', () => {
    it('should return a building by id', async () => {
      const building = { id: '1', name: 'Building 1' };

      mockBuildingsService.findOne.mockResolvedValue(building);

      const result = await controller.findOne('1');
      expect(result).toEqual(building);
    });
  });

  describe('update', () => {
    it('should update a building', async () => {
      const buildingDto = { name: 'Updated Building' };
      const building = { id: '1', ...buildingDto };

      mockBuildingsService.update.mockResolvedValue(building);

      const result = await controller.update('1', buildingDto);
      expect(result).toEqual(building);
    });
  });

  describe('remove', () => {
    it('should remove a building', async () => {
      mockBuildingsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(result).toBeUndefined();
    });
  });
});