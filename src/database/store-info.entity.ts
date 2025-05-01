import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';

@Entity('store_infos')
export class StoreInfo {
  @PrimaryGeneratedColumn()
  id: number;

  // 월요일
  @Column({ type: 'boolean', default: true })
  monday: boolean;
  @Column({ type: 'time', nullable: true })
  mondayStartTime: string;
  @Column({ type: 'time', nullable: true })
  mondayEndTime: string;

  // 화요일
  @Column({ type: 'boolean', default: true })
  tuesday: boolean;
  @Column({ type: 'time', nullable: true })
  tuesdayStartTime: string;
  @Column({ type: 'time', nullable: true })
  tuesdayEndTime: string;

  // 수요일
  @Column({ type: 'boolean', default: true })
  wednesday: boolean;
  @Column({ type: 'time', nullable: true })
  wednesdayStartTime: string;
  @Column({ type: 'time', nullable: true })
  wednesdayEndTime: string;

  // 목요일
  @Column({ type: 'boolean', default: true })
  thursday: boolean;
  @Column({ type: 'time', nullable: true })
  thursdayStartTime: string;
  @Column({ type: 'time', nullable: true })
  thursdayEndTime: string;

  // 금요일
  @Column({ type: 'boolean', default: true })
  friday: boolean;
  @Column({ type: 'time', nullable: true })
  fridayStartTime: string;
  @Column({ type: 'time', nullable: true })
  fridayEndTime: string;

  // 토요일
  @Column({ type: 'boolean', default: true })
  saturday: boolean;
  @Column({ type: 'time', nullable: true })
  saturdayStartTime: string;
  @Column({ type: 'time', nullable: true })
  saturdayEndTime: string;

  // 일요일
  @Column({ type: 'boolean', default: false })
  sunday: boolean;
  @Column({ type: 'time', nullable: true })
  sundayStartTime: string;
  @Column({ type: 'time', nullable: true })
  sundayEndTime: string;

  @Column({ type: 'double' })
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @OneToOne(() => Store, store => store.storeInfo)
  @JoinColumn()
  store: Store;
} 