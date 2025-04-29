import {
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  ValidateNested,
  IsArray,
  IsNumber,
  IsIn,
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

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
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
  @IsOptional()
  @IsUUID()
  sender_location_id?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsObject()
  from_address: AddressDto; // ✨ إضافة from_address إجباري

  @ValidateNested()
  @Type(() => AddressDto)
  @IsObject()
  to_address: AddressDto;

  @ValidateNested()
  @Type(() => RecipientInfoDto)
  @IsObject()
  recipient_info: RecipientInfoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentItemDto)
  items?: ShipmentItemDto[];

  @IsNumber()
  shipment_value: number;

  @IsOptional()
  @IsNumber()
  delivery_fee?: number;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsString()
  @IsIn(['cash', 'bank_transfer', 'online', 'not_paid'])
  payment_type: 'cash' | 'bank_transfer' | 'online' | 'not_paid';

  @IsString()
  @IsIn(['pending', 'paid', 'partial', 'failed', 'refunded'])
  payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';

  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
