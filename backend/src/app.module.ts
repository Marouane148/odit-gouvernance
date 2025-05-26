import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { ApartmentsModule } from './modules/apartments/apartments.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { RepartitionKeysModule } from './modules/repartition-keys/repartition-keys.module';
import { RateLimitMiddleware } from './shared/middlewares/rate-limit.middleware';
import { SecurityHeadersMiddleware } from './shared/middlewares/security-headers.middleware';
import { RequestLoggerMiddleware } from './shared/middlewares/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_DATABASE ?? 'charges_locatives',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    SharedModule,
    AuthModule,
    UsersModule,
    BuildingsModule,
    ApartmentsModule,
    TenantsModule,
    ExpensesModule,
    RepartitionKeysModule,
  ],
  providers: [
    RequestLoggerMiddleware,
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestLoggerMiddleware,
        SecurityHeadersMiddleware,
        RateLimitMiddleware,
      )
      .forRoutes('*');
  }
}

