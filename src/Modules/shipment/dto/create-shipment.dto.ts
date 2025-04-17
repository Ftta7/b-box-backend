import {
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class RecipientInfoDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class ToAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;
}

class ShipmentItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  sku?: string;
}

export class CreateShipmentDto {
  @IsUUID()
  sender_location_id: string;

  @ValidateNested()
  @Type(() => ToAddressDto)
  @IsObject()
  to_address: ToAddressDto;

  @ValidateNested()
  @Type(() => RecipientInfoDto)
  @IsObject()
  recipient_info: RecipientInfoDto;

  @IsUUID()
  shipment_type_id: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  items?: ShipmentItemDto[];
}
