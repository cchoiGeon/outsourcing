import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Store } from './store.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: Store;

  @Column()
  name: string; // 상품(음식) 이름

  @Column({ nullable: true })
  description?: string; // 상품 설명

  @Column()
  price: number; // 원래 가격

  @Column()
  quantity: number; // 남은 수량

  @Column({ nullable: true })
  imageUrl?: string; // 상품 사진 URL

  @Column()
  availableTime: Date; // 판매 마감 시간

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 