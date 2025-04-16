import { Controller, Get } from '@nestjs/common';
import { HubsService } from './hubs.service';

@Controller('hubs')
export class HubsController {
  constructor(private readonly service: HubsService) {}

  // @Get()
  // findAll() {
  //   return this.service.findAll();
  // }
}
