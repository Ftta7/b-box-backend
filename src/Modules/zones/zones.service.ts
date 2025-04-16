import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverZone } from './entities/driver-zone.entity';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(DriverZone)
    private readonly repo: Repository<DriverZone>,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
