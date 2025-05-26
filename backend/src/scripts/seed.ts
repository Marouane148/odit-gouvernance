import { DataSource } from 'typeorm';
import { Role } from '../modules/users/entities/role.entity';
import { UserRole } from '../modules/users/enums/user-role.enum';
import { User } from '../modules/users/entities/user.entity';
import { Building } from '../modules/buildings/entities/building.entity';
import { Apartment, ApartmentType } from '../modules/apartments/entities/apartment.entity';
import { Tenant } from '../modules/tenants/entities/tenant.entity';
import { OccupationPeriod } from '../modules/tenants/entities/occupation-period.entity';
import { Charge } from '../modules/charges/entities/charge.entity';
import { ChargeType } from '../modules/charges/enums/charge-type.enum';
import { DeepPartial } from 'typeorm';
import dataSource from '../config/typeorm.config';
import { Expense } from '../modules/expenses/entities/expense.entity';
import { RepartitionKey } from '../modules/repartition-keys/entities/repartition-key.entity';
import { DistributionKey } from '../modules/distribution-keys/entities/distribution-key.entity';

async function seed() {
  try {
    // Initialiser la connexion à la base de données
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Database connection initialized');

    // Vérifier si les rôles existent déjà
    const existingRoles = await dataSource.getRepository(Role).find();
    if (existingRoles.length === 0) {
      // Créer les rôles
      const roles: DeepPartial<Role>[] = [
        { name: UserRole.SUPER_ADMIN, description: 'Super Administrateur' },
        { name: UserRole.GESTIONNAIRE, description: 'Gestionnaire' },
        { name: UserRole.PROPRIETAIRE, description: 'Propriétaire' },
        { name: UserRole.COPROPRIETAIRE, description: 'Copropriétaire' }
      ];

      for (const role of roles) {
        const newRole = dataSource.getRepository(Role).create(role);
        await dataSource.getRepository(Role).save(newRole);
      }
      console.log('Roles created successfully');
    } else {
      console.log('Roles already exist, skipping creation');
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await dataSource.getRepository(User).findOne({
      where: { email: 'admin@example.com' }
    });

    if (!existingAdmin) {
      // Créer l'admin
      const adminRole = await dataSource.getRepository(Role).findOne({
        where: { name: UserRole.SUPER_ADMIN }
      });

      if (!adminRole) {
        throw new Error('SUPER_ADMIN role not found');
      }

      const admin: DeepPartial<User> = {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        roles: [adminRole]
      };

      await dataSource.getRepository(User).save(admin);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping creation');
    }

    // Créer les bâtiments
    const buildings: DeepPartial<Building>[] = [
      { 
        name: 'Building A', 
        address: '123 Main St',
        city: 'Paris',
        postalCode: '75001',
        totalSurface: 1000,
        numberOfApartments: 10,
        managementStartDate: new Date()
      },
      { 
        name: 'Building B', 
        address: '456 Oak St',
        city: 'Paris',
        postalCode: '75002',
        totalSurface: 800,
        numberOfApartments: 8,
        managementStartDate: new Date()
      }
    ];

    const savedBuildings: Building[] = [];
    for (const building of buildings) {
      const newBuilding = dataSource.getRepository(Building).create(building);
      savedBuildings.push(await dataSource.getRepository(Building).save(newBuilding));
    }
    console.log('Buildings created successfully');

    // Créer les appartements
    const apartments: DeepPartial<Apartment>[] = [];
    for (const building of savedBuildings) {
      for (let i = 1; i <= building.numberOfApartments; i++) {
        apartments.push({
          number: `${building.name}-${i}`,
          floor: Math.floor(i / 4) + 1,
          surface: 80 + Math.floor(Math.random() * 40),
          type: ApartmentType.APARTMENT,
          buildingId: building.id
        });
      }
    }

    const savedApartments: Apartment[] = [];
    for (const apartment of apartments) {
      const newApartment = dataSource.getRepository(Apartment).create(apartment);
      savedApartments.push(await dataSource.getRepository(Apartment).save(newApartment));
    }
    console.log('Apartments created successfully');

    // Créer les locataires
    const tenants: DeepPartial<Tenant>[] = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321'
      }
    ];

    const savedTenants: Tenant[] = [];
    for (const tenant of tenants) {
      const newTenant = dataSource.getRepository(Tenant).create(tenant);
      savedTenants.push(await dataSource.getRepository(Tenant).save(newTenant));
    }
    console.log('Tenants created successfully');

    // Créer les périodes d'occupation
    const occupationPeriods: DeepPartial<OccupationPeriod>[] = [
      {
        startDate: new Date(),
        apartmentId: savedApartments[0].id,
        tenantId: savedTenants[0].id
      },
      {
        startDate: new Date(),
        apartmentId: savedApartments[1].id,
        tenantId: savedTenants[1].id
      }
    ];

    for (const period of occupationPeriods) {
      const newPeriod = dataSource.getRepository(OccupationPeriod).create(period);
      await dataSource.getRepository(OccupationPeriod).save(newPeriod);
    }
    console.log('Occupation periods created successfully');

    // Créer les charges
    const charges: DeepPartial<Charge>[] = [
      {
        type: ChargeType.SURFACE,
        amount: 1000,
        description: 'Monthly elevator maintenance',
        date: new Date(),
        buildingId: savedBuildings[0].id
      },
      {
        type: ChargeType.FIXED,
        amount: 500,
        description: 'Monthly cleaning service',
        date: new Date(),
        buildingId: savedBuildings[0].id
      }
    ];

    for (const charge of charges) {
      const newCharge = dataSource.getRepository(Charge).create(charge);
      await dataSource.getRepository(Charge).save(newCharge);
    }
    console.log('Charges created successfully');

    // Fermer la connexion à la base de données
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seed(); 