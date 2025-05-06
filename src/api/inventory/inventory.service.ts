import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from 'src/database/inventory.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Store } from 'src/database/store.entity';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { AwsService } from '../aws/aws.service';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreOwnerProfile)
    private readonly storeOwnerProfileRepository: Repository<StoreOwnerProfile>,
    private readonly awsService: AwsService,
  ) {}

  async createInventory( uuid: string, dto: CreateInventoryDto, file?: Express.Multer.File) {
    const user = await this.storeOwnerProfileRepository.findOne({ where: { user: { uuid: uuid } }, relations: ['store'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const store = await this.storeRepository.findOne({ where: { id: user.store.id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.verificationStatus !== VerificationStatus.APPROVED) {
      throw new BadRequestException('Store is not approved');
    }

    if (file) { 
      const [ imageUrl ] = await this.awsService.uploadImagesToS3(file, 'jpg');
      dto.imageUrl = imageUrl;
    }

    const inventory = this.inventoryRepository.create({
      ...dto,
      store: store
    });

    return await this.inventoryRepository.save(inventory);  
  }

  async getTodayInventory() {
    const today = new Date();
    // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    // const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const now = new Date();
    
    const inventory = await this.inventoryRepository.find({
      where: {
        endTime: MoreThan(now)
      },
      relations: ['store', 'store.category']
    });
    return inventory.map(inventory => ({
      inventory: {
        id: inventory.id,
        name: inventory.name,
        price: inventory.price,
        imageUrl: inventory.imageUrl, 
        startTime: inventory.startTime,
        endTime: inventory.endTime,
      },
      store: {
        name: inventory.store.name,
        category: inventory.store.category.categoryName
      } 
    }));
  }

  async getInventoryByInventId(inventId: number) {
    const inventory = await this.inventoryRepository.findOne({ where: { id: inventId } , relations: ['store', 'store.category'] });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const now = new Date();
    if (inventory.endTime < now) {
      throw new BadRequestException('해당 상품의 판매 기간이 종료되었습니다.');
    }

    return inventory;
  }
}
