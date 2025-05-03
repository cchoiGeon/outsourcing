import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../../database/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Store } from 'src/database/store.entity';
import { StoreOwnerProfile } from 'src/database/store-owner-profile.entity';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, StoreOwnerProfile]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRESIN') },
      }),
      inject: [ConfigService],
    }),
    AwsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
