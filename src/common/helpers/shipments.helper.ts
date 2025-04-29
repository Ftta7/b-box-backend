import { getTranslation } from 'src/common/helpers/translation.helper';

export function transformDriverShipments(shipments: any[], language: 'ar' | 'en' = 'ar') {
  return shipments.map((shipment) => {
    const city = shipment.to_address?.city ?? '';
    const neighborhood = shipment.to_address?.neighborhood ?? '';
    const address = [city, neighborhood].filter(Boolean).join(' - ') || 'العنوان غير متوفر';

    return {
      id: shipment.id,
      tracking_number: shipment.tracking_number,
      recipient_name: shipment.recipient_info?.name ?? '',
      recipient_phone: shipment.recipient_info?.phone ?? '',
      address,
      status: getTranslation(
        shipment.status?.name_translations?.ar,
        shipment.status?.name_translations?.en,
        language
      ),
      shipment_value: shipment.shipment_value ?? '0',
      created_at: shipment.created_at,
    };
  });
}
