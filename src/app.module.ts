import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ApiKeyMiddleware } from './common/middleware/api-key.middleware';
import { ModulesAggregator } from './app.modules';

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
    }),
    ModulesAggregator,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   // consumer.apply(TenantMiddleware).forRoutes('*');
    consumer.apply(ApiKeyMiddleware).forRoutes('/integration/*');
  }
}
