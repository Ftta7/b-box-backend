// src/modules/driver-tracking/driver-location.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class DriverLocationService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private buildKey(carrierId: string, zone?: string): string {
    // Optional: zone-level separation for more granularity
    return zone
      ? `carrier:${carrierId}:locations:${zone}`
      : `carrier:${carrierId}:locations`;
  }

  /** 
   * Store or update driver's location in Redis GEO set per carrier (and optionally zone)
   */
  async updateLocation(
    carrierId: string,
    driverId: string,
    lat: number,
    lng: number,
    zone?: string
  ) {
    const key = this.buildKey(carrierId, zone);
    await this.redis.geoadd(key, lng, lat, `driver:${driverId}`);
  }

  /**
   * Get nearby drivers within radius for a given carrier (and optional zone)
   */
  async getNearbyDrivers(
    carrierId: string,
    lat: number,
    lng: number,
    radius = 5,
    zone?: string
  ) {
    const key = this.buildKey(carrierId, zone);
    return this.redis.georadius(key, lng, lat, radius, 'km');
  }

  /**
   * Get single driver's current position
   */
  async getDriverLocation(carrierId: string, driverId: string, zone?: string) {
    const key = this.buildKey(carrierId, zone);
    return this.redis.geopos(key, `driver:${driverId}`);
  }
}
