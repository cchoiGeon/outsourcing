import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { StoreCategory } from 'src/common/enum/store-category.enum';

@Entity('store_owner_profiles')
export class StoreOwnerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  storeName: string;

  @Column()
  storeAddress: string;

  @Column({ type: 'enum', enum: StoreCategory, default: StoreCategory.OTHER })
  storeCategory: StoreCategory;

  @Column({ nullable: true })
  storePhoneNumber: string;

  @Column({ nullable: true })
  verificationPhoto: string;

  @Column({ 
    type: 'enum', 
    enum: VerificationStatus, 
    default: VerificationStatus.PENDING 
  })
  verificationStatus: VerificationStatus;

  @OneToOne(() => User, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'uuid', referencedColumnName: 'uuid' })
  user: User;
} 