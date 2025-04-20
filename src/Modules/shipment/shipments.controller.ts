import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Request } from 'express';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Controller('integration/shipments') // ← المسار تحت تكامل
@UseGuards(ApiKeyGuard)
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) { }

  @Post()
  async create(
    @Body() dto: CreateShipmentDto,
    @Req() req: Request,
  ) {
    return this.shipmentsService.create({ ...dto, tenant_id: req['tenant_id'] });
  }

  @Get()
  async findAll(@Req() req: Request) {
    const filter = { tenant_id: req['tenant_id'] };
    return this.shipmentsService.listShipments(filter);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Req() req: Request) {
    const lang = (req as any).lang === 'en' ? 'en' : 'ar';
    const tenant_id = req['tenant_id'];
    return this.shipmentsService.getShipmentDetails(id,tenant_id ,lang);

  }
  
}
