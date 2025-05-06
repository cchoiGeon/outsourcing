import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Reservation } from 'src/database/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { Notification } from 'src/database/notification.entity';
import { Inventory } from 'src/database/inventory.entity';
import { ReservationStatus } from 'src/common/enum/reservation-status.enum';
@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(StoreOwnerProfile)
    private readonly storeOwnerProfileRepository: Repository<StoreOwnerProfile>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async createReservation(dto: CreateReservationDto, userUuid: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id: dto.inventoryId } , relations: ['store.storeOwnerProfiles.user']}); 
    const storeOwnerUuid = inventory.store.storeOwnerProfiles[0].user.uuid;
  
    const reservation = this.reservationRepository.create({
      ...dto,
      inventory: { id: dto.inventoryId },
      user: { uuid: userUuid },
    });
  
    const storeOwnerNotification = this.notificationRepository.create({
      title: '예약 요청이 왔습니다.',
      content: '예약 요청이 왔습니다.',
      user: { uuid: storeOwnerUuid },
    });
    await this.notificationRepository.save(storeOwnerNotification);

    const customerNotification = this.notificationRepository.create({
      title: '예약이 신청되었습니다.',
      content: '예약이 신청되었습니다.',
      user: { uuid: userUuid },
    });
    await this.notificationRepository.save(customerNotification);

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
    // const today = new Date();
    // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    // const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const ownerStore = await this.storeOwnerProfileRepository.findOne({
      where: { user: { uuid: userUuid } },
      relations: ['store'],
    });
    if (!ownerStore) {
      throw new NotFoundException('Store owner profile not found');
    }

    const storeId = ownerStore.store.id;
    
    const result = await this.reservationRepository.find({
      where: {
        inventory: { store: { id: storeId } },
        // createdAt: Between(startOfDay, endOfDay),
      },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    }); 
  
    return result.map((reservation) => ({
      id: reservation.id,
      userName: reservation.user.name,
      amount: reservation.amount,
      pickUpTime: reservation.pickUpTime,
      status: reservation.status,
      createdAt: reservation.createdAt,
    }));
  }

  async updateReservationStatus(reservationId: number, dto: UpdateReservationStatusDto) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['user', 'inventory']
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    reservation.status = dto.status;
    await this.reservationRepository.save(reservation);

    if (dto.status === ReservationStatus.COMPLETED) {
      const inventory = await this.inventoryRepository.findOne({
        where: { id: reservation.inventory.id },
      });
      inventory.quantity -= reservation.amount;
      await this.inventoryRepository.save(inventory);
    }

    const storeOwnerNotification = this.notificationRepository.create({
      title: dto.status === ReservationStatus.REJECTED ? '예약이 거절되었습니다.' : '예약이 확정되었습니다.',
      content: dto.status === ReservationStatus.REJECTED ? '예약이 거절되었습니다.' : '예약이 되었습니다.',
      user: { uuid: reservation.user.uuid },
    });
    await this.notificationRepository.save(storeOwnerNotification);

    return reservation;
  }
}
