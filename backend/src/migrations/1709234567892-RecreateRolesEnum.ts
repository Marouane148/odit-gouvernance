import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateRolesEnum1709234567892 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Supprimer l'ancien type enum s'il existe
        await queryRunner.query(`DROP TYPE IF EXISTS roles_name_enum`);

        // Créer le nouveau type enum
        await queryRunner.query(`
            CREATE TYPE roles_name_enum AS ENUM (
                'super_admin',
                'gestionnaire',
                'proprietaire',
                'coproprietaire'
            )
        `);

        // Modifier la colonne pour utiliser le nouveau type enum
        await queryRunner.query(`
            ALTER TABLE "roles" 
            ALTER COLUMN "name" TYPE roles_name_enum 
            USING CASE 
                WHEN name = 'super_admin' THEN 'super_admin'::roles_name_enum
                WHEN name = 'gestionnaire' THEN 'gestionnaire'::roles_name_enum
                WHEN name = 'proprietaire' THEN 'proprietaire'::roles_name_enum
                WHEN name = 'coproprietaire' THEN 'coproprietaire'::roles_name_enum
                ELSE 'proprietaire'::roles_name_enum
            END
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revenir à VARCHAR
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "name" TYPE VARCHAR`);
        await queryRunner.query(`DROP TYPE IF EXISTS roles_name_enum`);
    }
} 