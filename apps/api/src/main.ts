import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SIDI API')
    .setDescription('Documentação da API do projeto SIDI')
    .setVersion('1.0')
    .addTag('hello', 'Endpoint de verificação')
    .addTag('clients', 'Gestão de clientes')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Scalar UI em /api/reference
  app.use(
    '/api/reference',
    apiReference({
      spec: { content: document },
      theme: 'default',
    }),
  );

  const port = process.env.API_PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
  console.log(`Docs available on http://localhost:${port}/api/reference`);
}

bootstrap();
