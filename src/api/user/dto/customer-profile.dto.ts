import { IsString, IsOptional, Length } from 'class-validator';

export class CustomerProfileDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @IsOptional()
  @Length(10, 20)
  phoneNumber?: string;
} 