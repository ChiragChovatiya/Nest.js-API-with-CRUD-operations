import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      // Handle NestJS built-in validation errors array
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if ('message' in exceptionResponse) {
           message = Array.isArray((exceptionResponse as any).message) 
            ? (exceptionResponse as any).message[0] 
            : (exceptionResponse as any).message;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      status: false,
      code: status,
      message,
      data: null,
    });
  }
}
