import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '../../api/logger/logger.service';

@Catch() // 모든 예외를 잡음
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500; // 기본적으로 Internal Server Error
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      // 일반적인 런타임 오류 처리
      message = exception.message;
    }

    // WARN 로그 저장
    this.loggerService.warn(`[${request.method}] |IP: ${request.ip}| ${request.url} - Status: ${status}, Message: ${message}`);

    response.status(status).json({
      status: status,
      message: message,
    });
  }
}
