import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantSettlement } from './entities/tenant-settlement.entity';

@Injectable()
export class SettlementsService {
  constructor(
    @InjectRepository(TenantSettlement)
    private readonly repo: Repository<TenantSettlement>,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
