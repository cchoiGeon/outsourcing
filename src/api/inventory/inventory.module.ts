import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/database/inventory.entity';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { Store } from 'src/database/store.entity';
import { AwsModule } from '../aws/aws.module';
import { User } from 'src/database/users.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Inventory, StoreOwnerProfile, Store, User]), AwsModule],
  controllers: [InventoryController],
  providers: [InventoryService]
})
export class InventoryModule {}
