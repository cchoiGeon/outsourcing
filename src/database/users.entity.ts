import { Role } from 'src/common/enum/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;  // 추가된 부분

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 