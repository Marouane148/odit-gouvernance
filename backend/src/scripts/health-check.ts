import { DataSource } from 'typeorm';
import { Building } from '../modules/buildings/entities/building.entity';
import { Apartment } from '../modules/apartments/entities/apartment.entity';
import { Tenant } from '../modules/tenants/entities/tenant.entity';
import { Charge } from '../modules/charges/entities/charge.entity';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/users/entities/role.entity';

async function healthCheck() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'odit_gouvernance',
    entities: [Building, Apartment, Tenant, Charge, User, Role],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    // Check database connection
    const isConnected = dataSource.isInitialized;
    console.log('\nDatabase Connection Status:', isConnected ? 'Connected' : 'Disconnected');

    // Check entity counts
    const buildingCount = await dataSource.getRepository(Building).count();
    const apartmentCount = await dataSource.getRepository(Apartment).count();
    const tenantCount = await dataSource.getRepository(Tenant).count();
    const chargeCount = await dataSource.getRepository(Charge).count();
    const userCount = await dataSource.getRepository(User).count();
    const roleCount = await dataSource.getRepository(Role).count();

    console.log('\nEntity Counts:');
    console.log('Buildings:', buildingCount);
    console.log('Apartments:', apartmentCount);
    console.log('Tenants:', tenantCount);
    console.log('Charges:', chargeCount);
    console.log('Users:', userCount);
    console.log('Roles:', roleCount);

    // Check for orphaned records
    const orphanedApartments = await dataSource
      .getRepository(Apartment)
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.building', 'building')
      .where('building.id IS NULL')
      .getCount();

    const orphanedTenants = await dataSource
      .getRepository(Tenant)
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.apartment', 'apartment')
      .where('apartment.id IS NULL')
      .getCount();

    const orphanedCharges = await dataSource
      .getRepository(Charge)
      .createQueryBuilder('charge')
      .leftJoinAndSelect('charge.building', 'building')
      .where('building.id IS NULL')
      .getCount();

    console.log('\nOrphaned Records:');
    console.log('Orphaned Apartments:', orphanedApartments);
    console.log('Orphaned Tenants:', orphanedTenants);
    console.log('Orphaned Charges:', orphanedCharges);

    // Check database performance
    console.log('\nDatabase Performance:');
    const startTime = Date.now();
    await dataSource.query('SELECT 1');
    const queryTime = Date.now() - startTime;
    console.log('Query Response Time:', queryTime, 'ms');

    // Check database size
    const dbSize = await dataSource.query(
      "SELECT pg_size_pretty(pg_database_size(current_database())) as size"
    );
    console.log('Database Size:', dbSize[0].size);

  } catch (error) {
    console.error('Error during health check:', error);
  } finally {
    await dataSource.destroy();
    console.log('\nDatabase connection closed');
  }
}

healthCheck().catch(console.error); 