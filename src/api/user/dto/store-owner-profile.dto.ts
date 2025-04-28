import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { StoreCategory } from 'src/common/enum/store-category.enum';

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

  @IsEnum(StoreCategory)
  @IsNotEmpty()
  storeCategory: StoreCategory;

  @IsString()
  @IsOptional()
  storePhoneNumber?: string;
} 
