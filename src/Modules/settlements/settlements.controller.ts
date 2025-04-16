import { Controller, Get } from '@nestjs/common';
import { SettlementsService } from './settlements.service';

@Controller('settlements')
export class SettlementsController {
  constructor(private readonly service: SettlementsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
