import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../notification-type.enum';

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  recipient: string; // ??? ?????? ???? ?? ???? ????????

  @IsString()
  @IsNotEmpty()
  message: string;
}
