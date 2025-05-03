import { Expose, Type } from 'class-transformer';

class ShipmentStatusDto {
  @Expose() code: string;
  @Expose() color: string;

  @Expose({ name: 'name_' }) // إعادة تسمية الحقل ليطابق `name_`
  name: string;
}

class TenantDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() phone: string;
  @Expose() address: string;
}

class AddressDto {
  @Expose() lat: number;
  @Expose() lng: number;
  @Expose() city?: string;
  @Expose() street?: string;
  @Expose() neighborhood?: string;
}

class RecipientInfoDto {
  @Expose() name: string;
  @Expose() phone: string;
  @Expose() notes?: string;
}

class ItemDto {
  @Expose() sku?: string;
  @Expose() name: string;
  @Expose() quantity: number;
}

class AvailableActionDto {
  @Expose() code: string;
  @Expose() name: string;
  @Expose() color: string;
}

export class ShipmentDashboardDetailsDto {
  @Expose() id: string;
  @Expose() tracking_number: string;

  @Expose() @Type(() => ShipmentStatusDto)
  status: ShipmentStatusDto;

  @Expose() @Type(() => TenantDto)
  tenant: TenantDto;

  @Expose() carrier: any = null;
  @Expose() driver: any = null;

  @Expose() @Type(() => AddressDto)
  from_address: AddressDto;

  @Expose() @Type(() => AddressDto)
  to_address: AddressDto;

  @Expose() @Type(() => RecipientInfoDto)
  recipient_info: RecipientInfoDto;

  @Expose() delivery_fee: string;
  @Expose() platform_fee: string;
  @Expose() tenant_payout: string;
  @Expose() cod_amount: string;
  @Expose() shipment_value: string;
  @Expose() payment_status: string;
  @Expose() actual_payment_type: string;
  @Expose() created_at: Date;
  @Expose() delivered_at: Date;

  @Expose() @Type(() => ItemDto)
  items: ItemDto[];

  @Expose() @Type(() => AvailableActionDto)
  available_actions: AvailableActionDto[];

  @Expose() total_amount: string;
  @Expose() settlement_id: string;
  @Expose() updated_at: Date;
}
