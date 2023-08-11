import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './app/filters/prisma-client-exception.filter';
import { TransformInterceptor } from './app/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     exceptionFactory: (errors) => {
  //       const message = errors
  //         .map((e) =>
  //           Object.values(e.constraints as any)
  //             .map((v) => v)
  //             .join(', '),
  //         )
  //         .join(', ');

  //       return new GraphQLError(`Validation failed: [${message}]`, {
  //         extensions: { code: 'BAD_USER_INPUT' },
  //       });
  //     },
  //   }),
  // );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // app.useGlobalFilters(new BaseExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();

// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class GQLExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const type = host.getType();

//     if (type === 'http') {
//       return super.catch(exception, host);
//     } else {
//       throw exception;
//     }

//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     console.log(ctx)

//     response
//       .json({
//         timestamp: new Date().toISOString(),
//       });
//   }
// }

// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { ApiException } from '../api-exception.model';
// import { GqlExceptionFilter } from '@nestjs/graphql';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(error: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const res = ctx.getResponse();
//     const req = ctx.getRequest();
//     const statusCode = error.getStatus();
//     const stacktrace = error.stack;
//     const errorName = error.response.name || error.response.error || error.name;
//     const errors = error.response.errors || null;
//     const path = req ? req.url : null;

//     if (statusCode === HttpStatus.UNAUTHORIZED) {
//       if (typeof error.response !== 'string') {
//         error.response.message =
//           error.response.message ||
//           'You do not have permission to access this resource';
//       }
//     }

//     const exception = new ApiException(
//       error.response.message,
//       errorName,
//       stacktrace,
//       errors,
//       path,
//       statusCode,
//     );
//     res.status(statusCode).json(exception);
//   }
// }

// @Catch()
// export class LoggerExceptionFilter implements GqlExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     throw new Error('Method not implemented.');
//   }
//     constructor(private logger: Logger) { }
//     catch(exception: unknown, host: ArgumentsHost): any {
//       if (exception instanceof Error) {
//         const gqlHost = GqlArgumentsHost.create(host);
//         const gqlContext = gqlHost.getContext();
//         const req = gqlContext.req;
//         if (req) {
//           this.logger.error(
//             {
//               message: `Error: ${exception.message}`,
//               type: 'error',
//               stack: exception.stack,
//               requestId: req.headers['request-id'],
//             },
//             exception.stack,
//           );
//         } else {
//           this.logger.error(
//             {
//               message: `Error: ${exception.message}`,
//               type: 'error',
//               stack: exception.stack,
//             },
//             exception.stack,
//           );
//         }
//       }
//       return exception;
//     }
//   }
