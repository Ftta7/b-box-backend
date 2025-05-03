// src/modules/driver-tracking/driver-location.gateway.ts
import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { DriverLocationService } from './driver-location.service';
  import {
    BadRequestException,
    Logger,
  } from '@nestjs/common';
  
  @WebSocketGateway({ cors: true })
  export class DriverLocationGateway {
    private readonly logger = new Logger(DriverLocationGateway.name);
  
    constructor(private readonly locationService: DriverLocationService) {}
  
    /**
     * Event: 'driver_location_update'
     * Payload: { driver_id, carrier_id, lat, lng, zone?, shipment_id? }
     */
    @SubscribeMessage('driver_location_update')
    async handleLocationUpdate(
      @MessageBody()
      payload: {
        driver_id: string;
        carrier_id: string;
        lat: number;
        lng: number;
        zone?: string;
        shipment_id?: string;
      },
      @ConnectedSocket() client: Socket,
    ) {
      const { driver_id, carrier_id, lat, lng, zone, shipment_id } = payload;
  
      if (!driver_id || !carrier_id || typeof lat !== 'number' || typeof lng !== 'number') {
        throw new BadRequestException('Invalid location payload');
      }
  
      await this.locationService.updateLocation(carrier_id, driver_id, lat, lng, zone);
  
      this.logger.debug(
        `Updated location for driver ${driver_id} (carrier ${carrier_id}) → [${lat}, ${lng}]`
      );
  
      client.emit('location_update_ack', { success: true });
  
      // ✅ Optional broadcasting to shipment room if shipment_id exists
      if (shipment_id) {
        client.broadcast.to(`shipment:${shipment_id}`).emit('driver_location', {
          driver_id,
          lat,
          lng,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }
  