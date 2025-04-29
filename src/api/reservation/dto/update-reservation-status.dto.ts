import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../../../common/enum/reservation-status.enum';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;
} 