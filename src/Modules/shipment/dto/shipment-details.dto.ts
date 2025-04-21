import { LocalizedField } from 'src/common/decorators/localized-field.decorator';

export class ShipmentStatusHistoryItemDto {
  status_code: string;

  @LocalizedField()
  status_name: string;

  color: string;
  note?: string;
  created_at: Date;
}

export class ShipmentDetailsDto {
  id: string;
  status_code: string;

  @LocalizedField()
  status_name: string;

  color: string;

  to_address: any;
  recipient_info: any;
  items?: any[];

  shipment_value?: number;
  delivery_fee?: number;
  total_amount?: number;

  actual_payment_type?: 'cash' | 'bank_transfer' | 'online' | 'not_paid';
  payment_status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';

  status_history: ShipmentStatusHistoryItemDto[];
}
