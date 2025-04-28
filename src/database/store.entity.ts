import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { VerificationStatus } from 'src/common/enum/status.enum';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  category: string;

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