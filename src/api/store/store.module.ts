import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/database/store.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
