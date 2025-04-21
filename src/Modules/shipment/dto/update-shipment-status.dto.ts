import { IsUUID, IsString, IsOptional } from 'class-validator';

export class UpdateShipmentStatusDto {
  @IsUUID()
  shipment_id: string;

  @IsString()
  new_status_code: string;

  @IsOptional()
  @IsString()
  note?: string;
}
