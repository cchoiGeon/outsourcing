import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/deco/get-user.deco';
import { NotificationService } from './notification.service';
import { RoleGuard } from 'src/common/guard/role.guard';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard, RoleGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@GetUser() user) {
    return await this.notificationService.getNotifications(user.uuid);
  } 
}
