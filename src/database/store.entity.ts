import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VerificationStatus } from 'src/common/enum/status.enum';
import { Category } from './category.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

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
} 