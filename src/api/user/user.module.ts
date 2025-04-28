import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../database/users.entity';
import { UserProfile } from '../../database/user-profile.entity';
import { StoreOwnerProfile } from '../../database/store-owner-profile.entity';
import { Store } from 'src/database/store.entity';
import { AwsModule } from '../aws/aws.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, StoreOwnerProfile, Store]),
    AwsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
