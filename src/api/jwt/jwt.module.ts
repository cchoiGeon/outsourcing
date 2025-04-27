import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJsJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../database/users.entity.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestJsJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRESIN'),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtStrategy, JwtAuthGuard],
})
export class JwtModule {}
