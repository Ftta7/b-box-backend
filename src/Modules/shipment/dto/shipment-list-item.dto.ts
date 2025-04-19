import { LocalizedField } from 'src/common/decorators/localized-field.decorator';

export class ShipmentListItemDto {
  id: string;

  @LocalizedField()
  status_name: string;

  color: string
  ;
  recipient_name: string;

  to_city: string;
  
  created_at: Date;
}
