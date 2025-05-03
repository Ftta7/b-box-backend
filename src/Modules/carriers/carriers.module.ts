import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { CarrierCity } from './entities/carrier-city.entity';
import { CarrierUser } from '../users/entities/carrier-user.entity';
import { CarrierController } from './carrier.controller';
import { CarrierService } from './carrier.service';
import { WalletTransaction } from './entities/carrier-wallet-transaction.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Carrier, CarrierCity, CarrierUser,WalletTransaction])],
  controllers: [CarrierController],
  providers: [CarrierService],
})
export class CarriersModule {}
