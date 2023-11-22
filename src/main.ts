import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as serveStatic from 'serve-static';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/assets',serveStatic('assets'));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(
    {
      credentials: true,
    }
  );
  await app.listen(3000);
}
bootstrap();
