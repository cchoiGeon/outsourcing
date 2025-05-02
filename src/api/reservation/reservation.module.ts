import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/database/reservation.entity';  
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { Inventory } from 'src/database/inventory.entity';
import { Notification } from 'src/database/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, StoreOwnerProfile, Inventory, Notification])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
