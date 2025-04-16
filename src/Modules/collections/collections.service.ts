import { DeliveryCollection } from "./entities/delivery-collection.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(DeliveryCollection)
    private readonly repo: Repository<DeliveryCollection>,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
