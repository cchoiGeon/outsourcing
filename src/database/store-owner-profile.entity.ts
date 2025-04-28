import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';

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

  @Column()
  storeCategory: string;

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