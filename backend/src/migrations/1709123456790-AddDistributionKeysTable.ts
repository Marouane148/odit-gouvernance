import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistributionKeysTable1709123456790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table distribution_keys
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS distribution_keys (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        value NUMERIC(10,2) NOT NULL,
        description TEXT,
        "buildingId" UUID NOT NULL REFERENCES buildings(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Ajout des contraintes de clé étrangère
    await queryRunner.query(`
      ALTER TABLE distribution_keys
      ADD CONSTRAINT fk_distribution_keys_buildings
      FOREIGN KEY ("buildingId")
      REFERENCES buildings(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS distribution_keys;`);
  }
} 