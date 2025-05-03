import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInventoryDto {
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
  startTime: string; // ISO 문자열로 받음

  @IsString()
  @IsNotEmpty()
  endTime: string; // ISO 문자열로 받음
} 