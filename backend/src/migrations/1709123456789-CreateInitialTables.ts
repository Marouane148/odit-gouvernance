import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1709123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Création de la table buildings
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS buildings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        "managementStartDate" DATE NOT NULL,
        "managementEndDate" DATE,
        description TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table apartments
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS apartments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        number VARCHAR NOT NULL,
        surface NUMERIC(10,2) NOT NULL,
        floor INTEGER NOT NULL,
        type VARCHAR NOT NULL,
        "buildingId" UUID NOT NULL REFERENCES buildings(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table tenants
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone VARCHAR NOT NULL,
        "apartmentId" UUID NOT NULL REFERENCES apartments(id),
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP,
        "emergencyContact" VARCHAR,
        notes TEXT,
        "guarantorName" VARCHAR,
        "guarantorPhone" VARCHAR,
        "guarantorEmail" VARCHAR,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table occupation_periods
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS occupation_periods (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP,
        notes TEXT,
        "tenantId" UUID NOT NULL REFERENCES tenants(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table expenses
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type VARCHAR NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        "invoiceNumber" VARCHAR,
        "invoiceFile" VARCHAR,
        "buildingId" UUID NOT NULL REFERENCES buildings(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table repartition_keys
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS repartition_keys (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        value NUMERIC(10,2) NOT NULL,
        "buildingId" UUID NOT NULL REFERENCES buildings(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        "roleId" UUID NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Création de la table roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Ajout des contraintes de clé étrangère pour users
    await queryRunner.query(`
      ALTER TABLE users
      ADD CONSTRAINT fk_users_roles
      FOREIGN KEY ("roleId")
      REFERENCES roles(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Suppression des tables dans l'ordre inverse
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
    await queryRunner.query(`DROP TABLE IF EXISTS repartition_keys;`);
    await queryRunner.query(`DROP TABLE IF EXISTS expenses;`);
    await queryRunner.query(`DROP TABLE IF EXISTS occupation_periods;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tenants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS apartments;`);
    await queryRunner.query(`DROP TABLE IF EXISTS buildings;`);
  }
} 