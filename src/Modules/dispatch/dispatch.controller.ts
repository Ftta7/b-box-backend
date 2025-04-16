import { Controller, Get } from '@nestjs/common';
import { DispatchService } from './dispatch.service';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly service: DispatchService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
