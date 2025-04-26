export const ShipmentStatusFlow: Record<string, string[]> = {
    pending: ['assigned'],
    assigned: ['picked_up'],
    picked_up: ['in_transit'],
    in_transit: ['delivered', 'failed'],
    delivered: [],
    failed: [],
    cancelled: [],
  };