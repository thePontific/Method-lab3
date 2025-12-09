import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common'; // Добавь
import { Reflector } from '@nestjs/core'; // Добавь

const hbs = require('hbs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Добавь интерцептор для class-transformer
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll', // исключает все поля без @Expose()
    }),
  );

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();