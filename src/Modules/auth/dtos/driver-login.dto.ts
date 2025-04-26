import { IsPhoneNumber, IsString } from 'class-validator';


export class DriverLoginDto {
  @IsPhoneNumber('SD') // "SD" = Sudan
  phone: string;

  @IsString()
  password: string;
}
