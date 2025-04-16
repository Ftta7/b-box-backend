import { Controller, Get } from '@nestjs/common';
import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController {
  constructor(private readonly service: ZonesService) {}

  // @Get()
  // findAll() {
  //   return this.service.findAll();
  // }
}