import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  quantity: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
} 

export class UpdateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  quantity: number;
}
