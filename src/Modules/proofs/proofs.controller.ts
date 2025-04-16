import { Controller, Get } from '@nestjs/common';
import { ProofsService } from './proofs.service';

@Controller('proofs')
export class ProofsController {
  constructor(private readonly service: ProofsService) {}

  // @Get()
  // findAll() {
  //   return this.service.findAll();
  // }
}
