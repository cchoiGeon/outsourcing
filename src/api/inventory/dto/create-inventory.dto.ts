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
} 