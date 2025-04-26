// src/modules/users/dto/create-driver.dto.ts
import { IsString, IsPhoneNumber, MinLength, IsOptional, IsUUID, IsEnum } from 'class-validator';


export class CreateDriverDto {
  @IsString()
  full_name: string;

  @IsPhoneNumber('SD')
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsUUID()
  tenant_id: string;

  @IsOptional()
  is_bbox_driver?: boolean = false;

  @IsOptional()
  @IsEnum(['salary', 'commission'])
  payment_type?: 'salary' | 'commission' = 'salary';

  @IsOptional()
  commission_rate?: number;
}
