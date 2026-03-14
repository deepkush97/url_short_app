import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { Logger } from 'nestjs-pino';

import { version } from '../package.json';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  const configService = app.get(ConfigService);
  const PORT: string = configService.get('APP_PORT');

  const config = new DocumentBuilder()
    .setTitle('Short url app')
    .setDescription('API documentation for short url')
    .setVersion(version)

    .addTag('cats')
    .build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(+PORT);
}
void bootstrap();
