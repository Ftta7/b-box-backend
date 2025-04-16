import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProofOfDelivery } from './entities/proof-of-delivery.entity';

@Injectable()
export class ProofsService {
  constructor(
    @InjectRepository(ProofOfDelivery)
    private readonly repo: Repository<ProofOfDelivery>,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
