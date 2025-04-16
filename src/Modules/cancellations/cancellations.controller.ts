import { Controller, Get } from '@nestjs/common';
import { CancellationsService } from './cancellations.service';

@Controller('cancellations')
export class CancellationsController {
  constructor(private readonly service: CancellationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
