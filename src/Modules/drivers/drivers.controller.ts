import { Controller, Get, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Controller('integration/drivers')
@UseGuards(ApiKeyGuard)
export class DriversController {
  constructor(private readonly service: DriversService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
