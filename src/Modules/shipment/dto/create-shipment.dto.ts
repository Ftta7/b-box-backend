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


  @IsNumber()
  lat: number;  // Latitude of the address
  
  @IsNumber()
  lng: number;  // Longitude of the address 
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

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
@IsUUID()
tenant_id?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  items?: ShipmentItemDto[];

}
