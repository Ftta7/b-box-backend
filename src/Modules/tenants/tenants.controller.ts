import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { ApiKeyGuard } from 'src/guards/api-key.guard';


@Controller('integration/tenants')
@UseGuards(ApiKeyGuard)
export class TenantsController {
  constructor() {}


}
