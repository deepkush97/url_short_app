import { GlobalInterceptor } from '@app/shared/global.interceptor';
import { RequestValidationPipe } from '@app/shared/request-validation.pipe';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new GlobalInterceptor());
  app.useGlobalPipes(new RequestValidationPipe());

  const configService = app.get(ConfigService);
  const PORT = configService.get('APP_PORT');
  await app.listen(+PORT);
}
bootstrap();
