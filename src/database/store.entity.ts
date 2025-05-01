import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { Category } from './category.entity';
import { Inventory } from './inventory.entity';
import { StoreInfo } from './store-info.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  verificationPhoto?: string;

  @Column({ 
    type: 'enum', 
    enum: VerificationStatus, 
    default: VerificationStatus.PENDING 
  })
  verificationStatus: VerificationStatus;

  @OneToMany(() => Inventory, inventory => inventory.store)
  inventories: Inventory[];

  @OneToOne(() => StoreInfo, storeInfo => storeInfo.store)
  storeInfo: StoreInfo;
} 