import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GraphQLError } from 'graphql';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const message = errors
          .map((e) =>
            Object.values(e.constraints as any)
              .map((v) => v)
              .join(', '),
          )
          .join(', ');

        return new GraphQLError(`Validation failed: [${message}]`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
