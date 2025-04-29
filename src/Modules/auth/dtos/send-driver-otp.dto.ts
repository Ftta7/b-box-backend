import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendDriverOtpDto {
  @IsPhoneNumber('SD') // لو تريد أكثر مرونة، خليها IsString
  @IsNotEmpty()
  phone_number: string;
}
