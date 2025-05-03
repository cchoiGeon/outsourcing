import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './api/logger/logger.service';
import { HttpExceptionFilter } from './common/filter/http-exception';
import { CustomValidationPipe } from './common/pipe/validationPipe.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  
  // CORS 설정 추가
  app.enableCors({
    origin: true, // 모든 출처 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.setGlobalPrefix('v1/api');
  await app.listen(80);
}
bootstrap();
