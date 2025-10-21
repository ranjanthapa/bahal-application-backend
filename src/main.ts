import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseInterceptor());
 
    await app.listen(port);
    Logger.log(`Running on http://localhost:${port}`);
  } catch (e) {
    Logger.log(e.message);
  }
}
bootstrap();
