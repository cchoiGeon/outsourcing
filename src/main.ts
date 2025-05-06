import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './api/logger/logger.service';
import { HttpExceptionFilter } from './common/filter/http-exception';
import { CustomValidationPipe } from './common/pipe/validationPipe.pipe';
import * as fs from 'fs';
async function bootstrap() {
  const port = process.env.NODE_ENV == 'prd' ? 443 : 80;
  const isProd = process.env.NODE_ENV === 'prd';

  const httpsOptions = isProd
    ? {
        key: fs.readFileSync('/opt/bitnami/letsencrypt/certificates/testhttpsserver.store.key', 'utf8'),
        cert: fs.readFileSync('/opt/bitnami/letsencrypt/certificates/testhttpsserver.store.crt', 'utf8'),
        ca: fs.readFileSync('/opt/bitnami/letsencrypt/certificates/testhttpsserver.store.issuer.crt', 'utf8'),
      }
    : undefined;

  const app = await NestFactory.create(AppModule, isProd ? { httpsOptions } : undefined);
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
  await app.listen(port);
}
bootstrap();
