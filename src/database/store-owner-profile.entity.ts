import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { Store } from './store.entity';

@Entity('store_owner_profiles')
export class StoreOwnerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @OneToOne(() => Store, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: Store;

  @OneToOne(() => User, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'uuid' })
  user: User;
} 