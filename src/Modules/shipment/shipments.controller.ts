import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Request } from 'express';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Controller('integration/shipments') // ← المسار تحت تكامل
@UseGuards(ApiKeyGuard)
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  async create(
    @Body() dto: CreateShipmentDto,
    @Req() req: Request,
  ) {
    const tenant_id = req['tenant_id'];
    return this.shipmentsService.create(dto, tenant_id);
  }

  @Get()
  async findAll() {
    return this.shipmentsService.findAll();
  }
}
