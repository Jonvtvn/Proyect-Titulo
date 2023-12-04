import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aumentar el límite de tamaño de carga a 10 megabytes (puedes ajustar esto según tus necesidades)
  app.use(express.json({ limit: '10mb' }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://186.64.113.85:3000');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.enableCors();

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3001);
}

bootstrap();