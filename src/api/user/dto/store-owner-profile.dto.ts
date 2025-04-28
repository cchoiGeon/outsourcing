import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class StoreOwnerProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  storeAddress: string;

  @IsString()
  @IsNotEmpty()
  storeCategory: string;

  @IsString()
  @IsOptional()
  storePhoneNumber?: string;
} 
