import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../database/users.entity';
import { AwsModule } from '../aws/aws.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AwsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
