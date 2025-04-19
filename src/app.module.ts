import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ApiKeyMiddleware } from './common/middleware/api-key.middleware';
import { ModulesAggregator } from './app.modules';
import { LanguageMiddleware } from './common/middleware/language.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
    }),
    ModulesAggregator,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('/integration/*');
    consumer
    .apply(LanguageMiddleware)
    .forRoutes('*');
  }
}
