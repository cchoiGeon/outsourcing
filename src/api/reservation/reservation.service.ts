import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Reservation } from 'src/database/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(StoreOwnerProfile)
    private readonly storeOwnerProfileRepository: Repository<StoreOwnerProfile>,
  ) {}

  async createReservation(dto: CreateReservationDto, userUuid: string) {
    const reservation = this.reservationRepository.create({
      ...dto,
      inventory: { id: dto.inventoryId },
      user: { uuid: userUuid },
    });
    return await this.reservationRepository.save(reservation);
  }

  async getAllReservations(userUuid: string) {
    const result = await this.reservationRepository.find({
      where: { user: { uuid: userUuid } },
      order: { createdAt: 'DESC' },
      relations: ['inventory', 'inventory.store'],
    });
    return result.map((reservation) => ({
      id: reservation.id,
      inventoryImage: reservation.inventory.imageUrl,
      inventoryName: reservation.inventory.name,
      inventoryPrice: reservation.inventory.price,
      storeName: reservation.inventory.store.name,
      storeAddress: reservation.inventory.store.address,
      storeCategory: reservation.inventory.store.category,
      amount: reservation.amount,
      pickUpTime: reservation.pickUpTime,
      status: reservation.status,
      createdAt: reservation.createdAt,
    }));
  }

  async getTodayReservationsByStoreOwner(userUuid: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const ownerStore = await this.storeOwnerProfileRepository.findOne({
      where: { user: { uuid: userUuid } },
      relations: ['store'],
    });
    if (!ownerStore) {
      throw new NotFoundException('Store owner profile not found');
    }
    if (ownerStore.store.verificationStatus !== VerificationStatus.APPROVED) {
      throw new NotFoundException('Store owner profile not verified');
    }

    const storeId = ownerStore.store.id;
    
    const result = await this.reservationRepository.find({
      where: {
        inventory: { store: { id: storeId } },
        createdAt: Between(startOfDay, endOfDay),
      },
      relations: ['user', 'user.profile'],
    }); 
  
    return result.map((reservation) => ({
      id: reservation.id,
      userName: reservation.user.profile?.name ?? '이름 없음',
      amount: reservation.amount,
      pickUpTime: reservation.pickUpTime,
      status: reservation.status,
      createdAt: reservation.createdAt,
    }));
  }

  async updateReservationStatus(reservationId: number, dto: UpdateReservationStatusDto) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    reservation.status = dto.status;
    return await this.reservationRepository.save(reservation);
  }
}
