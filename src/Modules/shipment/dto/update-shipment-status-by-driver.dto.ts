import { IsUUID, IsString } from 'class-validator';

export class UpdateShipmentStatusByDriverDto {
  @IsUUID()
  shipment_id: string;

  @IsString()
  new_status_code: string;

  @IsString()
  note: string;
}
