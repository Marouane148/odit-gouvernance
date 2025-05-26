import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import testDataSource from '../../ormconfig.test';

let app: INestApplication;
let dataSource: DataSource;

// Augmenter le timeout à 30 secondes
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Utiliser la configuration de test
    dataSource = await testDataSource.initialize();
    
    // Exécuter les migrations
    await dataSource.runMigrations();
  } catch (error) {
    console.error('Error in beforeAll:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    // Désactiver temporairement les contraintes de clé étrangère
    await dataSource.query('SET session_replication_role = replica;');

    // Nettoyage de la base de données avant chaque test
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      try {
        const repository = dataSource.getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
      } catch (error) {
        // Ignorer les erreurs de table inexistante
        if (error.message.includes('n\'existe pas')) {
          continue;
        }
        throw error;
      }
    }

    // Réactiver les contraintes de clé étrangère
    await dataSource.query('SET session_replication_role = DEFAULT;');
  } catch (error) {
    console.error('Error in beforeEach:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    if (app) {
      await app.close();
    }
  } catch (error) {
    console.error('Error in afterAll:', error);
    throw error;
  }
});

export { app, request, dataSource }; 