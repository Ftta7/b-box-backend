import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancellationsService } from './cancellations.service';
import { CancellationsController } from './cancellations.controller';
import { ShipmentCancellation } from './entities/shipment-cancellation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentCancellation])],
  providers: [CancellationsService],
  controllers: [CancellationsController],
  exports: [CancellationsService],
})
export class CancellationsModule {}
