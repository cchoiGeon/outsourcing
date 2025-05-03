import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from 'src/database/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getAllStores() {
    const stores = await this.storeRepository.find({
      relations: ['category'],
    });

    return stores.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      imageUrl: store.imageUrl,
      category: {
        id: store.category.id,
        name: store.category.categoryName,
      },
    }));
  }

  async getStoreById(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['category', 'inventories'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      imageUrl: store.imageUrl,
      category: {
        id: store.category.id,
        name: store.category.categoryName,
      },
      phoneNumber: store.phoneNumber,
      inventories: store.inventories
        .filter(inventory => new Date(inventory.endTime) > new Date())
        .map(inventory => ({
          id: inventory.id,
          name: inventory.name,
          price: inventory.price,
          imageUrl: inventory.imageUrl,
          endTime: inventory.endTime,
        })),
      storeInfo: store.storeInfo,
      storePickupTime: store.storePickupTime,
    };
  }
}
