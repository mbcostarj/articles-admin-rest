import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmailAlreadyExistFilter } from './modules/users/filters/email-already-exists.filter';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundErrorFilter } from './common/filters/not-found.filter';
import { InvalidCredentialsErrorFilter } from './modules/auth/filters/invalid-credentials-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new EmailAlreadyExistFilter(),
    new NotFoundErrorFilter(),
    new InvalidCredentialsErrorFilter()
  );
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(3000, '0.0.0.0');
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
