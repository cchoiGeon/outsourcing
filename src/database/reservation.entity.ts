import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { User } from './users.entity';
import { ReservationStatus } from '../common/enum/reservation-status.enum';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userUuid' })
  user: User;

  @Column({ 
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING
  })
  status: ReservationStatus;

  @Column()
  amount: number;

  @Column()
  pickUpTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 