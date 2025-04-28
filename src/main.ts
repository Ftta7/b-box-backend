import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ✅ تحديد البريفكس العام
  app.setGlobalPrefix('api');

  // ✅ تفعيل الـ versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ✅ إضافات الحماية والكفاءة
  app.use(helmet());
  app.use(compression());
  app.enableCors();

  // ✅ تفعيل البايب لاين للفاليديشن
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ✅ إعداد Swagger
  const config = new DocumentBuilder()
    .setTitle('BBox API')
    .setDescription('API documentation for BBox Delivery System')
    .setVersion('1.0')
    .addTag('Tenant Settlements')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ وضع swagger تحت /api/swagger
  SwaggerModule.setup('api/swagger', app, document);

  // ✅ serve ملفات ثابتة
  app.use('/sandbox', express.static(join(__dirname, '..', 'src/public')));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
