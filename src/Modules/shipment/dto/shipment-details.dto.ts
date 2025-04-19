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

  assigned_driver?: {
    id: string;
    name: string;
  };

  status_history: ShipmentStatusHistoryItemDto[];
}
