import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { Category } from './category.entity';
import { Inventory } from './inventory.entity';
import { StoreOwnerProfile } from './store-owner-profile.entity';

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

  @Column({ type: 'double' })
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @Column()
  storeInfo: string;
  
  @Column()
  storePickupTime: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  siteUrl: string

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

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @OneToMany(() => StoreOwnerProfile, (storeOwnerProfile) => storeOwnerProfile.store)
  storeOwnerProfiles: StoreOwnerProfile[];
} 