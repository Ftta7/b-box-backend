import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService], // ✨ مهم للتصدير لباقي الموديولات
})
export class NotificationModule {}
