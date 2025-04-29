import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/database/reservation.entity';  
import { UserProfile } from 'src/database/user-profile.entity';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, StoreOwnerProfile, UserProfile])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
