import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Building } from '../src/entities/building.entity';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

describe('BuildingsController (e2e)', () => {
  let app: INestApplication;
  let buildingRepository: any;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Building))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    buildingRepository = moduleFixture.get(getRepositoryToken(Building));

    // Créer un utilisateur de test
    const testUser = {
      email: 'test@test.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'gestionnaire'  // Un rôle avec les permissions nécessaires
    };

    // Enregistrer l'utilisateur
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    // Se connecter pour obtenir le token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    authToken = loginResponse.body.access_token;

    if (!authToken) {
      throw new Error('Failed to obtain authentication token');
    }
  });

  it('/buildings (POST) - success', () => {
    const newBuilding = {
      name: 'Test Building',
      address: '123 Test St',
      managementStartDate: new Date().toISOString(),
      description: 'Test description'
    };

    buildingRepository.create.mockReturnValue(newBuilding);
    buildingRepository.save.mockResolvedValue({ ...newBuilding, id: '1' });

    return request(app.getHttpServer())
      .post('/buildings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBuilding)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(newBuilding.name);
      });
  });

  // Ajouter le header Authorization pour les autres tests
  it('/buildings (GET) - success', () => {
    const buildings = [
      { id: '1', name: 'Building 1', address: 'Address 1', managementStartDate: new Date() },
      { id: '2', name: 'Building 2', address: 'Address 2', managementStartDate: new Date() }
    ];

    buildingRepository.find.mockResolvedValue(buildings);

    return request(app.getHttpServer())
      .get('/buildings')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].name).toBe(buildings[0].name);
      });
  });

  it('/buildings/:id (GET) - success', () => {
    const building = {
      id: '1',
      name: 'Test Building',
      address: '123 Test St',
      managementStartDate: new Date()
    };

    buildingRepository.findOne.mockResolvedValue(building);

    return request(app.getHttpServer())
      .get('/buildings/1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(building.name);
      });
  });

  it('/buildings/:id (PATCH) - success', async () => {
    const buildingId = '123e4567-e89b-12d3-a456-426614174000';
    const existingBuilding = {
      id: buildingId,
      name: 'Test Building',
      address: '123 Test St',
      managementStartDate: new Date(),
      description: 'Test description',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updateData = { name: 'Updated Building' };

    // Mock pour findOne qui retourne toujours le même bâtiment pour les deux appels
    buildingRepository.findOne.mockImplementation(({ where }) => {
      if (where?.id === buildingId) {
        return Promise.resolve({
          ...existingBuilding,
          ...(buildingRepository.update.mock.calls.length > 0 ? updateData : {})
        });
      }
      return Promise.resolve(null);
    });

    // Mock pour update
    buildingRepository.update.mockImplementation((id, data) => {
      if (id === buildingId) {
        return Promise.resolve({ affected: 1 });
      }
      return Promise.resolve({ affected: 0 });
    });

    await request(app.getHttpServer())
      .put(`/buildings/${buildingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(updateData.name);
      });
  });

  it('/buildings/:id (DELETE) - success', () => {
    buildingRepository.delete.mockResolvedValue({ affected: 1 });

    return request(app.getHttpServer())
      .delete('/buildings/1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});