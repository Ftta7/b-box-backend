import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofsService } from './proofs.service';
import { ProofsController } from './proofs.controller';
import { ProofOfDelivery } from './entities/proof-of-delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProofOfDelivery])],
  providers: [ProofsService],
  controllers: [ProofsController],
  exports: [ProofsService],
})
export class ProofsModule {}
