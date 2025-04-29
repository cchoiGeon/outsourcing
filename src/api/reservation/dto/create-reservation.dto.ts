import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  inventoryId: number;

  @IsDateString()
  @IsNotEmpty()
  pickUpTime: string; // ISO 8601 형식의 날짜 문자열

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
