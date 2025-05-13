import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from 'src/database/inventory.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/create-inventory.dto';
import { Store } from 'src/database/store.entity';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { AwsService } from '../aws/aws.service';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { User } from 'src/database/users.entity'; 
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreOwnerProfile)
    private readonly storeOwnerProfileRepository: Repository<StoreOwnerProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
  ) {}

  async deleteInventory(inventId: number, userUuid: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id: inventId }, relations: ['store', 'store.storeOwnerProfiles'] });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (!inventory.store.storeOwnerProfiles.some(profile => profile.user.uuid === userUuid)) {
      throw new BadRequestException('You are not the owner of this inventory');
    }

    await this.inventoryRepository.delete(inventId);
  }

  async updateInventory(inventId: number, dto: UpdateInventoryDto, userUuid: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id: inventId }, relations: ['store', 'store.storeOwnerProfiles'] });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (!inventory.store.storeOwnerProfiles.some(profile => profile.user.uuid === userUuid)) {
      throw new BadRequestException('You are not the owner of this inventory');
    }

    inventory.quantity = dto.quantity;
    return await this.inventoryRepository.save(inventory);
  }

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

  async getTodayInventory(userUuid: string) {
    const now = new Date();
    const user = await this.userRepository.findOne({ where: { uuid: userUuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === Role.STORE_OWNER) {
      const storeOwner = await this.storeOwnerProfileRepository.findOne({ where: { user: { uuid: userUuid } }, relations: ['store'] });
      if (!storeOwner) {
        throw new NotFoundException('Store owner not found');
      }
      const inventory = await this.inventoryRepository.find({
        where: {
          store: { id: storeOwner.store.id },
          endTime: MoreThan(now)
        },
        relations: ['store', 'store.category']
      });
      return inventory.map(inventory => ({
        inventory: {
          id: inventory.id,
          name: inventory.name,
          price: inventory.price,
          quantity: inventory.quantity, 
          imageUrl: inventory.imageUrl,
          startTime: inventory.startTime,
          endTime: inventory.endTime,
        },
        store: {
          name: inventory.store.name,
          category: inventory.store.category.categoryName
        }
      }));
    } else {
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
          quantity: inventory.quantity,
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
