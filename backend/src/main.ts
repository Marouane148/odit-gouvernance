import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './shared/services/logger.service';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { CacheInterceptor } from './shared/interceptors/cache.interceptor';
import { CacheService } from './shared/services/cache.service';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const configService = app.get(ConfigService);
  const logger = new CustomLogger();
  logger.setContext('Bootstrap');

  // Configuration CORS
  const frontendUrl = configService.get('FRONTEND_URL');
  const corsOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
  if (frontendUrl) {
    corsOrigins.push(frontendUrl);
  }

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600,
  });

  // Sécurité
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  }));
  app.use(compression());

  // Configuration des pipes globaux
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration des filtres globaux
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuration des intercepteurs globaux
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new CacheInterceptor(app.get(CacheService), app.get(Reflector)),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestion des Charges Locatives')
    .setDescription('API pour la gestion des charges locatives')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Endpoints d\'authentification')
    .addTag('buildings', 'Gestion des immeubles')
    .addTag('apartments', 'Gestion des appartements')
    .addTag('tenants', 'Gestion des locataires')
    .addTag('charges', 'Gestion des charges')
    .addTag('expenses', 'Gestion des dépenses')
    .addTag('repartition-keys', 'Gestion des clés de répartition')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}

bootstrap();
