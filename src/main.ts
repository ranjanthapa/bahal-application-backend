import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  try {
    const app = await NestFactory.create(AppModule);
    const reflector = app.get(Reflector); // Nest injects Reflector

    app.useGlobalInterceptors(new ResponseInterceptor(reflector));

    await app.listen(4000, '0.0.0.0');
    Logger.log(app.getUrl());
    Logger.log(`Running on http://localhost:${4000}`);
  } catch (e) {
    Logger.log(e.message);
  }
}
bootstrap();
