import { DataSource } from 'typeorm';
import { Building } from '../modules/buildings/entities/building.entity';
import { Apartment } from '../modules/apartments/entities/apartment.entity';
import { Tenant } from '../modules/tenants/entities/tenant.entity';
import { Charge } from '../modules/charges/entities/charge.entity';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/users/entities/role.entity';

async function validateEntities() {
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

    // Validate Building entity
    const buildingMetadata = dataSource.getMetadata(Building);
    console.log('\nBuilding Entity Validation:');
    console.log('Relations:', buildingMetadata.relations.map(r => r.propertyName));
    console.log('Columns:', buildingMetadata.columns.map(c => c.propertyName));

    // Validate Apartment entity
    const apartmentMetadata = dataSource.getMetadata(Apartment);
    console.log('\nApartment Entity Validation:');
    console.log('Relations:', apartmentMetadata.relations.map(r => r.propertyName));
    console.log('Columns:', apartmentMetadata.columns.map(c => c.propertyName));

    // Validate Tenant entity
    const tenantMetadata = dataSource.getMetadata(Tenant);
    console.log('\nTenant Entity Validation:');
    console.log('Relations:', tenantMetadata.relations.map(r => r.propertyName));
    console.log('Columns:', tenantMetadata.columns.map(c => c.propertyName));

    // Validate Charge entity
    const chargeMetadata = dataSource.getMetadata(Charge);
    console.log('\nCharge Entity Validation:');
    console.log('Relations:', chargeMetadata.relations.map(r => r.propertyName));
    console.log('Columns:', chargeMetadata.columns.map(c => c.propertyName));

    // Validate User entity
    const userMetadata = dataSource.getMetadata(User);
    console.log('\nUser Entity Validation:');
    console.log('Relations:', userMetadata.relations.map(r => r.propertyName));
    console.log('Columns:', userMetadata.columns.map(c => c.propertyName));

    // Validate Role entity
    const roleMetadata = dataSource.getMetadata(Role);
    console.log('\nRole Entity Validation:');
    console.log('Relations:', roleMetadata.relations.map(r => r.propertyName));
    console.log('Columns:', roleMetadata.columns.map(c => c.propertyName));

    // Check for circular dependencies
    console.log('\nChecking for circular dependencies...');
    const entities = [Building, Apartment, Tenant, Charge, User, Role];
    for (const entity of entities) {
      const metadata = dataSource.getMetadata(entity);
      for (const relation of metadata.relations) {
        const targetEntity = relation.inverseEntityMetadata.target;
        const targetMetadata = dataSource.getMetadata(targetEntity);
        const reverseRelation = targetMetadata.relations.find(
          r => r.inverseEntityMetadata.target === entity
        );
        if (reverseRelation) {
          console.log(`Found relation between ${metadata.name} and ${targetMetadata.name}`);
        }
      }
    }

  } catch (error) {
    console.error('Error during entity validation:', error);
  } finally {
    await dataSource.destroy();
    console.log('\nDatabase connection closed');
  }
}

validateEntities().catch(console.error); 