import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/database/inventory.entity';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { Store } from 'src/database/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, StoreOwnerProfile, Store])],
  controllers: [InventoryController],
  providers: [InventoryService]
})
export class InventoryModule {}
