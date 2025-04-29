import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetUser } from 'src/common/deco/get-user.deco';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/enum/role.enum';
import { CheckRole } from 'src/common/deco/check-role.deco';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Controller('reservation')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @CheckRole(Role.CUSTOMER)
  async createReservation(@Body() dto: CreateReservationDto, @GetUser() user) {
    return await this.reservationService.createReservation(dto, user.uuid);
  }

  @Get('/customer')
  @CheckRole(Role.CUSTOMER)
  async getAllReservations(@GetUser() user) {
    return await this.reservationService.getAllReservations(user.uuid);
  }

  @Get('/store-owner')
  @CheckRole(Role.STORE_OWNER)
  async getTodayReservationsByStoreOwner(@GetUser() user) {
    return await this.reservationService.getTodayReservationsByStoreOwner(user.uuid);
  }

  @Patch('/:reservationId')
  @CheckRole(Role.STORE_OWNER)
  async updateReservationStatus(@Param('reservationId') reservationId: number, @Body() dto: UpdateReservationStatusDto) {
    return await this.reservationService.updateReservationStatus(reservationId, dto);
  }
}
