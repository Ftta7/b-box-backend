import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationType } from './notification-type.enum';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://localhost:3004/send-message';
  private readonly whatsappApiKey = process.env.WHATSAPP_API_KEY || 'your-api-key-here';

  async sendNotification(dto: SendNotificationDto) {
    switch (dto.type) {
      case NotificationType.WHATSAPP:
        return this.sendWhatsAppMessage(dto.recipient, dto.message);
      default:
        throw new Error("Notification type  is not supported.");
    }
  }

  private async sendWhatsAppMessage(recipient: string, message: string) {
    try {
      const response = await axios.post(this.whatsappApiUrl+"send-message", {
        number: recipient,
        message: message,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.whatsappApiKey,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }
}
