import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAllStores() {
    return await this.storeService.getAllStores();
  }

  @Get(':id')
  async getStoreById(@Param('id') id: number) {
    return await this.storeService.getStoreById(id);
  }
}
