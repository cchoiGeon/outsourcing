import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from 'src/database/inventory.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Store } from 'src/database/store.entity';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly awsService: AwsService,
  ) {}

  async createInventory(dto: CreateInventoryDto, file?: Express.Multer.File) {
    const store = await this.storeRepository.findOne({ where: { id: dto.storeId } });
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
      store: store,
    });


    return await this.inventoryRepository.save(inventory);  
  }

  async getTodayInventory() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const inventory = await this.inventoryRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });
    return inventory;
  }

  async getInventoryByInventId(inventId: number) {
    const inventory = await this.inventoryRepository.findOne({ where: { id: inventId } , relations: ['store'] });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    } 
    return inventory;
  }
}
