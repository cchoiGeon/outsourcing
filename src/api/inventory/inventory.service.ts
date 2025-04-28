import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from 'src/database/inventory.entity';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Store } from 'src/database/store.entity';
import { VerificationStatus } from 'src/common/enum/status.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async createInventory(dto: CreateInventoryDto) {
    const store = await this.storeRepository.findOne({ where: { id: dto.storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.verificationStatus !== VerificationStatus.APPROVED) {
      throw new BadRequestException('Store is not approved');
    }

    const inventory = this.inventoryRepository.create({
      ...dto, 
      store: store,
    });


    return await this.inventoryRepository.save(inventory);  
  }

  async getAllInventory() {
    const inventory = await this.inventoryRepository.find({ where: { store: { verificationStatus: VerificationStatus.APPROVED } } , relations: ['store'] });
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
