import { Controller, Get, Post, Param, Req, UseGuards, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TenantSettlementsService } from './tenant-settlements.service';
import { Request } from 'express';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@ApiTags('Tenant Settlements')
@Controller('integration/settlements')
@UseGuards(ApiKeyGuard)
export class TenantSettlementsController {
  constructor(private readonly settlementsService: TenantSettlementsService) {}

  @Post()
  @ApiOperation({ summary: 'Generate new settlement for a tenant' })
  @ApiResponse({ status: 201, description: 'Settlement generated successfully' })
  @ApiResponse({ status: 400, description: 'No paid shipments to settle' })
  async generate(@Req() req: Request) {
    const tenant_id = req['tenant_id'];
    return this.settlementsService.generateTenantSettlement(tenant_id);
  }

  @Get()
  @ApiOperation({ summary: 'List all settlements for the tenant' })
  @ApiResponse({ status: 200, description: 'Returns a list of settlements' })
  async list(@Req() req: Request) {
    const tenant_id = req['tenant_id'];
    return this.settlementsService.listSettlements(tenant_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific settlement' })
  @ApiResponse({ status: 200, description: 'Returns detailed settlement info' })
  @ApiResponse({ status: 404, description: 'Settlement not found' })
  async getOne(@Param('id') id: string, @Req() req: Request) {
    const tenant_id = req['tenant_id'];
    return this.settlementsService.getSettlementDetails(id, tenant_id);
  }

  // ✅ تأكيد تسوية
  @Patch(':id/confirm')
  async confirm(
    @Param('id') id: string,
    @Body('confirmed_by') confirmed_by: string, // مثلاً adminId أو "system"
  ) {
    return this.settlementsService.confirmSettlement(id, confirmed_by);
  }
}
