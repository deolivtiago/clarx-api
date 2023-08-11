import {
  ArgumentsHost,
  Catch,
  ContextType,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const type = host.getType<ContextType | 'graphql'>();

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      console.error(exception);

      response.status(status).json({
        errors: exception.message,
      });
    }

    console.log(host);
  }
}
