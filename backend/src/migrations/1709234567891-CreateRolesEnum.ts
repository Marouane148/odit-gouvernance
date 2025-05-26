import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesEnum1709234567891 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Créer le type enum
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE roles_name_enum AS ENUM ('super_admin', 'gestionnaire', 'proprietaire', 'coproprietaire');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Modifier la colonne pour utiliser le nouveau type enum
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE roles_name_enum USING name::roles_name_enum`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revenir à VARCHAR si nécessaire
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE VARCHAR`);
    }
} 