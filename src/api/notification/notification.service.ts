import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Notification } from 'src/database/notification.entity';  

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications(userUuid: string) {
    return await this.notificationRepository.find({ where: { user: { uuid: userUuid } , createdAt: MoreThan(new Date(Date.now() - 1000 * 60 * 60 * 24)) }, order: { createdAt: 'DESC' }  }); 
  }
}