import { IsEmail, IsString, MinLength, IsNotEmpty, ValidateNested, IsObject, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerSignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() 
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  university: string;
} 

class StoreDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  storeAddress: string;

  @IsString()
  @IsNotEmpty()
  storePhoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  storeCategory: number;

  @IsString()
  @IsNotEmpty()
  storeInfo: string;

  @IsString()
  @IsNotEmpty()
  storePickupTime: string;
}

export class StoreOwnerSignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() 
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsObject()
  @ValidateNested()
  @Type(() => StoreDto)
  store: StoreDto;
}
