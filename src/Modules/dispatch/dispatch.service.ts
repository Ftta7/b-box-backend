import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispatchRule } from './entities/dispatch-rule.entity';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(DispatchRule)
    private readonly repo: Repository<DispatchRule>,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
