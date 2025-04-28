import { Controller, Post, UseGuards, Body, Get, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Role } from 'src/common/enum/role.enum';
import { CheckRole } from 'src/common/deco/check-role.deco';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RoleGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('/')
  @CheckRole(Role.STORE_OWNER)
  async createInventory(@Body() dto: CreateInventoryDto) {
    return await this.inventoryService.createInventory(dto);
  }

  @Get('/')
  async getAllInventory() {
    return await this.inventoryService.getAllInventory();
  }

  @Get('/:inventId')
  async getInventoryByInventId(@Param('inventId') inventId: number) {
    return await this.inventoryService.getInventoryByInventId(inventId);
  }
}
