import {Injectable } from '@nestjs/common';
import {InjectRepository } from '@nestjs/typeorm';
import {Repository } from 'typeorm';
import { ShipmentCancellation } from './entities/shipment-cancellation.entity';

@Injectable()
export class CancellationsService {
  constructor(
    @InjectRepository(ShipmentCancellation)
    private readonly repo: Repository<ShipmentCancellation>,
  ) {}

  findAll() {{
    return this.repo.find();
  }
  }
}