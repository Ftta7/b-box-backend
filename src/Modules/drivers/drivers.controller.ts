import { Body, Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { JwtAuthGuard } from 'src/authintication/jwt.guard';
import { DriverGuard } from 'src/guards/driver.guard';
import { ShipmentsService } from '../shipment/shipments.service';
import { UpdateShipmentStatusByDriverDto } from '../shipment/dto/update-shipment-status-by-driver.dto';

@Controller('drivers')
@UseGuards(JwtAuthGuard, DriverGuard)
export class DriversController {
  constructor(private readonly service: DriversService,private readonly shipmentsService:ShipmentsService) {}

  @Get('shipments')
  async getDriverShipments(@Query() query: any, @Req() req) {
    const driverId = req.user.driver_id;
    return this.shipmentsService.getShipmentsListByDriver(driverId, query, req.lang);
  }

  @Get(':id/shipment')
async getShipmentById(@Param('id') id: string, @Req() req) {
  const driverId = req.user.driver_id;
  return this.shipmentsService.getOneForDriver(driverId, id);
}

@Put('shipment/update-status')
async updateShipmentStatusByDriver(
  @Body() dto: UpdateShipmentStatusByDriverDto,
  @Req() req,
) {
  const driverId = req.user.driver_id;
  return this.shipmentsService.driverUpdateShipmentStatus(driverId, dto);
}

@Get('status-summary')
async getSummaryByDriver(
  @Req() req,
) {
  const driverId = req.user.driver_id;
  const result = await this.shipmentsService.getDriverShipmentStatusSummary(driverId, req.lang);
  return {
    success: true,
    message: 'Shipment status summary fetched successfully',
    data: result
  };
}

}
