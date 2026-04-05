import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  try {
    const app = await NestFactory.create(AppModule);
    const reflector = app.get(Reflector); // Nest injects Reflector

    app.useGlobalInterceptors(new ResponseInterceptor(reflector));
    const config = new DocumentBuilder()
      .setTitle('Bahal API')
      .setDescription('Bahal Property Management API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    await app.listen(4000, '0.0.0.0');
    Logger.log(app.getUrl());
    Logger.log(`Running on http://localhost:${4000}`);
  } catch (e) {
    Logger.log(e.message);
  }
}
bootstrap();
