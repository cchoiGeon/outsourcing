import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  availableTime: string; // ISO 문자열로 받음

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
} 