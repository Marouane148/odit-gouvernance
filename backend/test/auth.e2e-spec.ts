import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
  });

  it('/auth/register (POST) - success', async () => {
    const newUser = {
      email: 'test@test.com',
      password: 'TestPass123',  // Respecte le format requis
      firstName: 'Test',
      lastName: 'User',
      role: 'gestionnaire'  // Rôle explicite pour les tests des bâtiments
    };

    // Mock pour vérifier que l'email n'existe pas
    userRepository.findOne.mockResolvedValue(null);
    
    // Mock pour la création et la sauvegarde
    const savedUser = {
      id: '1',
      ...newUser,
      password: await bcrypt.hash(newUser.password, 10)
    };
    userRepository.create.mockReturnValue(savedUser);
    userRepository.save.mockResolvedValue(savedUser);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(newUser.email);
      });
  });

  it('/auth/login (POST) - success', async () => {
    const loginCredentials = {
      email: 'test@test.com',
      password: 'TestPass123'
    };

    // Mock pour la validation de l'utilisateur
    const user = {
      id: '1',
      email: loginCredentials.email,
      password: await bcrypt.hash(loginCredentials.password, 10),
      role: 'gestionnaire',
      firstName: 'Test',
      lastName: 'User'
    };

    userRepository.findOne.mockResolvedValue(user);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCredentials)
      .expect(200)  // Le login doit retourner 200
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});