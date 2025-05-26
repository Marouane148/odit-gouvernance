import { createConnection } from 'typeorm';
import { databaseConfig } from '../config/database.config';

async function validateDatabase() {
  try {
    console.log('Connecting to database...');
    const connection = await createConnection(databaseConfig);
    console.log('Successfully connected to database');

    // Vérifier les tables
    const tables = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Available tables:', tables.map(t => t.table_name));

    // Vérifier les relations
    const relations = await connection.query(`
      SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY';
    `);
    console.log('Foreign key relationships:', relations);

    // Vérifier les index
    const indexes = await connection.query(`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM
        pg_indexes
      WHERE
        schemaname = 'public'
      ORDER BY
        tablename,
        indexname;
    `);
    console.log('Database indexes:', indexes);

    await connection.close();
    console.log('Database validation completed successfully');
  } catch (error) {
    console.error('Database validation failed:', error);
    process.exit(1);
  }
}

validateDatabase(); 