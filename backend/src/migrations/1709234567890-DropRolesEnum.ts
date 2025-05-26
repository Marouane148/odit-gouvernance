import { MigrationInterface, QueryRunner } from "typeorm";

export class DropRolesEnum1709234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la contrainte d'enum existante
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE VARCHAR`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recréer l'enum si nécessaire
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE VARCHAR`);
    }
} 