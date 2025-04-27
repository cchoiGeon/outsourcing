import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { JwtModule } from './api/jwt/jwt.module';
import { LoggerModule } from './api/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/database/entity/*.entity.{ts,js}'],
        synchronize: false,
      }),
    }),
    AuthModule, 
    JwtModule, 
    LoggerModule
  ],
})
export class AppModule {}
