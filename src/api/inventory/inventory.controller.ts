import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { InventoryService } from './inventory.service';
import { GetUser } from 'src/common/deco/get-user.deco';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RoleGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('')
  async createInventory(@GetUser() user, @Body() dto: CreateInventoryDto) {
    return await this.inventoryService.createInventory(user.uuid, dto);
  }
}
